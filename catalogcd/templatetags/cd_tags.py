# -*- coding: utf-8 -*-

from django import template
from django.template import Node, NodeList, Template, Context, Variable
from django.template import get_library, Library, InvalidTemplateLibrary
from django.utils.translation import ugettext_lazy as _
import settings
import os
import re

register = template.Library()

#######################################################################################################################
#######################################################################################################################

@register.filter(name='equal_in_get')
def equal_in_get(x, y):
	try: x = int(x)
	except: pass
	try: y = int(y)
	except: pass
	if x == y: return True
	return False
		
#######################################################################################################################
#######################################################################################################################
