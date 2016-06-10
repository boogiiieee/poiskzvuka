# -*- coding: utf-8 -*-

from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.views.generic import list_detail
from django.contrib.auth.models import User
from django.contrib.sites.models import Site
from django.core.mail import send_mail
from django.utils.translation import ugettext_lazy as _
from django.contrib import messages
from django.db.models import Count
from django.db import connection, transaction
from django.utils import simplejson
import datetime
import settings
import threading
import string

from feedback.models import FeedBackItem
from feedback.forms import FeedBackForm
from feedback.views import letter_send_mail
from configuration.models import ConfigModel
from catalogcd.models import CatalogCD, CategoryCD

##########################################################################
##########################################################################


def catalog(request, context_processors=None):
	page = 1
	if 'page' in request.GET:
		try: page = int(request.GET.get('page'))
		except TypeError: raise Http404()
	
	if 'cat' in request.GET:
		cat = int(request.GET.get('cat'))
		category = CategoryCD.objects.get(id=cat)
	else:
		try:
			cat = CategoryCD.objects.filter(is_active=True,parent__isnull=False)[0].id
			category = CategoryCD.objects.get(id=cat)
		except: cat = -1
	
	
	cursor = connection.cursor()
	cursor.execute("SELECT SUBSTRING(UPPER(artist), 1, 1) AS first_simbol, COUNT(*) AS count_simbol FROM catalogcd_catalogcd WHERE is_active=true AND category_id=%d GROUP BY first_simbol ORDER BY first_simbol;" % cat)                
	filt = cursor.fetchall()
	
	try: q = filt[0][0]
	except: q = -1

	if 'cat' and 'q' in request.GET:
		q = request.GET.get('q')
	if cat and q:
		cds = CatalogCD.objects.filter(is_active=True,artist__startswith=q, category__id=cat)	
	else:
		cds = CatalogCD.objects.filter(is_active=True)	
	
	return list_detail.object_list(
		request,
		queryset = cds,
		paginate_by = settings.PAGINATE_BY,
		page = page,
		template_name = 'catalog/catalogcd.html',
		template_object_name = 'cd',
		extra_context = {
			'filt': filt,
			'q': q,
			'cat': cat,
			'category_list':CategoryCD.tree.root_nodes().filter(is_active=True),
			'category': category
		}
	)

##########################################################################
##########################################################################

from feedback.views import feedback_views

def contacts(request):
	return feedback_views(request, template='contacts/contacts.html', extra_context={'active':6})

################################################################################################################
################################################################################################################


	
##########################################################################
##########################################################################