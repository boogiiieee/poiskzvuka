# -*- coding: utf-8 -*-

from django.contrib import admin
from sorl.thumbnail.admin import AdminImageMixin
from mptt.admin import MPTTModelAdmin, MPTTChangeList

from catalogcd.models import CatalogCD, Country, CategoryCD

################################################################################################################
################################################################################################################

#Страна
class CountryAdmin(admin.ModelAdmin):
	list_display = ('title', 'is_active')
	search_fields = ('title',)
	list_filter = ('is_active',)

admin.site.register(Country, CountryAdmin)

################################################################################################################
################################################################################################################

#Категория
class CategoryCDAdmin(MPTTModelAdmin):
	list_display = ('title', 'small_image', 'is_active', 'sort')
	fieldsets = ((None, {'fields': ('parent', 'title', 'image', 'text', 'is_active', 'sort')}),)
	search_fields = ('title',)
	list_filter = ('is_active',)

admin.site.register(CategoryCD, CategoryCDAdmin)

################################################################################################################
################################################################################################################

#Каталог
class CatalogCDAdmin(AdminImageMixin, admin.ModelAdmin):
	list_display = ('artist', 'album', 'category', 'label', 'cost', 'country', 'small_image', 'is_active')
	search_fields = ('artist', 'album', 'label')
	list_filter = ('artist', 'album', 'category', 'country', 'label', 'is_active')
 
admin.site.register(CatalogCD, CatalogCDAdmin)

################################################################################################################
################################################################################################################