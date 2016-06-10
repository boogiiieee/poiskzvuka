# -*- coding: utf-8 -*-

from django.contrib import admin
from admintrans.admin import *

from feedback.models import FeedBackItem

################################################################################################################
################################################################################################################

class FeedBackItemAdmin(admin.ModelAdmin):
	list_display = ('name', 'email', 'phone', 'date')
	list_filter = ('date',)
	
admin.site.register(FeedBackItem, FeedBackItemAdmin)

################################################################################################################
################################################################################################################