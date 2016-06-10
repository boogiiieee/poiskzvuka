# -*- coding: utf-8 -*-

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import ValidationError
from tinymce import models as TinymceField
import re
import os
import settings

from pytils.translit import slugify
from sorl.thumbnail import ImageField as SorlImageField
from sorl.thumbnail.shortcuts import get_thumbnail, delete
from mptt.models import MPTTModel, TreeForeignKey, TreeManyToManyField

################################################################################################################
################################################################################################################

#Страны
class Country(models.Model):
	title = models.CharField(max_length=500, verbose_name=_('title'))
	is_active = models.BooleanField(verbose_name=_('is active'), default=True)
	
	def __unicode__(self):
		return self.title
		
	class Meta: 
		verbose_name = _('country') 
		verbose_name_plural = _('countrys')
		ordering = ['title']
		
################################################################################################################
################################################################################################################

#Категории
class CategoryCD(MPTTModel):
	parent = TreeForeignKey('self', verbose_name=_("parent"), blank=True, null=True, related_name='children_category')
	title = models.CharField(max_length=500, verbose_name=_('title'))
	slug = models.CharField(max_length=500, verbose_name=_('slug'), blank=True)
	text = TinymceField.HTMLField(max_length=10000, verbose_name=_('text'), blank=True, help_text=_('description category. not show'))
	image = SorlImageField(max_length=500, upload_to='upload/categorycd/', verbose_name=_('image'), blank=True, null=True)
	
	is_active = models.BooleanField(verbose_name=_('is active'), default=True)
	sort = models.IntegerField(verbose_name=_('sort'), default=0)
	
	def __unicode__(self):
		return self.title
			
	class Meta: 
		verbose_name = _('category cd') 
		verbose_name_plural = _('categorys cd')
		ordering = ['sort']
		
	class MPTTMeta:
		parent_attr = 'parent'
		order_insertion_by = ['sort']
		
	def get_breadcrumbs(self):
		return list(self.get_ancestors(ascending=False, include_self=True).filter(is_active=True))
		
	#Возвращает имя
	def get_title(self):
		return self.title
		
	#Возвращает картинку
	def get_image(self):
		if self.image:
			return self.image
		return ''
		
	#Возвращает подкатегории
	def get_subcategory(self):
		return self.get_children().filter(is_active=True)
		
	def small_image(self):
		if self.image:
			f = get_thumbnail(self.image, '80x60', crop='center', quality=99, format='PNG')
			html = '<a href="%s"><img src="%s" title="%s" /></a>'
			return html % (self.image.url, f.url, self.title)
		return u'<img src="/media/img/no_image_min.png" title="%s" />' % self.title

	small_image.short_description = _("Image")
	small_image.allow_tags = True
	
	def get_all_products(self):
		return self.cds_category.all()
		
	def clean(self):
		r = re.compile('^([a-zA-Z0-9_-]+)\.(jpg|jpeg|png|bmp|gif)$', re.IGNORECASE)
		if self.image:
			if not r.findall(os.path.split(self.image.url)[1]):
				raise ValidationError(_("File name validation error."))

	def save(self, *args, **kwargs):
		self.slug = slugify(self.title)
		super(CategoryCD, self).save(*args, **kwargs)
		
################################################################################################################
################################################################################################################


#Каталог
class CatalogCD(models.Model):
	category = models.ForeignKey(CategoryCD, verbose_name=_('category cd'), related_name='cds_category')
	artist = models.CharField(max_length=500, verbose_name=_("artist"))
	album = models.CharField(max_length=500, verbose_name=_("album"), blank=True)
	label = models.CharField(max_length=500, verbose_name=_("label"), blank=True)
	image = SorlImageField(max_length=500, upload_to='upload/catalogcd/', verbose_name=_('image'), blank=True, null=True)
	country = models.ForeignKey(Country, verbose_name=_('country'), blank=True, null=True)
	text = TinymceField.HTMLField(max_length=100000, verbose_name=_("text"), blank=True)
	cost = models.CharField(max_length=100, verbose_name=_("cost"), blank=True)
	is_active = models.BooleanField(verbose_name=_("is_active"), default=True)
	
	def __unicode__(self):
		return u'#%d - %s' % (self.id,self.artist)
		
	def clean(self):
		r = re.compile('^([a-zA-Z0-9_-]+)\.(jpg|jpeg|png|bmp|gif)$', re.IGNORECASE)
		if self.image:
			if not r.findall(os.path.split(self.image.url)[1]):
				raise ValidationError(_("File name validation error."))
		if self.category:
			print self.category.parent
			if self.category.parent==None:
				raise ValidationError(_("Error. In root categories there can't be goods"))
				
				
	def small_image(self):
		if self.image:
			f = get_thumbnail(self.image, 'x60', crop='center', quality=99, format='PNG')
			html = '<a href="%s"><img src="%s" title="%s" /></a>'
			return html % (self.image.url, f.url, self.artist)
		return u'<img src="/media/img/no_image_min.png" title="%s" />' % self.artist

	small_image.short_description = _("Image")
	small_image.allow_tags = True
		
	@models.permalink
	def get_item_url(self):
		return ('catalogcd_item_url', (), {'id': self.id})
		
	def get_title(self):
		if self.album:
			return u'%s - %s' % (self.artist, self.album)
		return u'%s' % self.artist
	
	def get_category_id(self):
		return self.category.id
	
	def get_artist(self):
		return self.artist
		
	def get_album(self):
		return self.album
		
	def get_label(self):
		return self.label
		
	def get_country(self):
		return self.country
		
	def get_text(self):
		return self.text
		
	def get_image(self):
		return self.image
		
	def get_cost(self):
		return self.cost
		
	def get_q(self):
		q = self.artist[0]
		return '%s' % q
		
	def get_page(self):
		q = self.get_q
		count_page = CatalogCD.objects.filter(is_active=True,artist__startswith=q, artist__lte=self.artist).order_by('artist').count()
		page = (count_page-1)/settings.PAGINATE_BY+1
		return '%s' % page
		
	def get_absolute_url(self):
		return '?cat=%d&q=%s&page=%s&id=%d' % (self.get_category_id(), self.get_q(), self.get_page(), self.id)
		
	class Meta: 
		verbose_name = _("catalog cd") 
		verbose_name_plural = _("catalog cds")
		ordering = ['artist', 'id',]
		
################################################################################################################
################################################################################################################# -*- coding: utf-8 -*-

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import ValidationError
from tinymce import models as TinymceField
import re
import os
import settings

from pytils.translit import slugify
from sorl.thumbnail import ImageField as SorlImageField
from sorl.thumbnail.shortcuts import get_thumbnail, delete
from mptt.models import MPTTModel, TreeForeignKey, TreeManyToManyField

################################################################################################################
################################################################################################################

#Страны
class Country(models.Model):
	title = models.CharField(max_length=500, verbose_name=_('title'))
	is_active = models.BooleanField(verbose_name=_('is active'), default=True)
	
	def __unicode__(self):
		return self.title
		
	class Meta: 
		verbose_name = _('country') 
		verbose_name_plural = _('countrys')
		ordering = ['title']
		
################################################################################################################
################################################################################################################

#Категории
class CategoryCD(MPTTModel):
	parent = TreeForeignKey('self', verbose_name=_("parent"), blank=True, null=True, related_name='children_category')
	title = models.CharField(max_length=500, verbose_name=_('title'))
	slug = models.CharField(max_length=500, verbose_name=_('slug'), blank=True)
	text = TinymceField.HTMLField(max_length=10000, verbose_name=_('text'), blank=True, help_text=_('description category. not show'))
	image = SorlImageField(max_length=500, upload_to='upload/categorycd/', verbose_name=_('image'), blank=True, null=True)
	
	is_active = models.BooleanField(verbose_name=_('is active'), default=True)
	sort = models.IntegerField(verbose_name=_('sort'), default=0)
	
	def __unicode__(self):
		return self.title
			
	class Meta: 
		verbose_name = _('category cd') 
		verbose_name_plural = _('categorys cd')
		ordering = ['sort']
		
	class MPTTMeta:
		parent_attr = 'parent'
		order_insertion_by = ['sort']
		
	def get_breadcrumbs(self):
		return list(self.get_ancestors(ascending=False, include_self=True).filter(is_active=True))
		
	#Возвращает имя
	def get_title(self):
		return self.title
		
	#Возвращает картинку
	def get_image(self):
		if self.image:
			return self.image
		return ''
		
	#Возвращает подкатегории
	def get_subcategory(self):
		return self.get_children().filter(is_active=True)
		
	def small_image(self):
		if self.image:
			f = get_thumbnail(self.image, '80x60', crop='center', quality=99, format='PNG')
			html = '<a href="%s"><img src="%s" title="%s" /></a>'
			return html % (self.image.url, f.url, self.title)
		return u'<img src="/media/img/no_image_min.png" title="%s" />' % self.title

	small_image.short_description = _("Image")
	small_image.allow_tags = True
	
	def get_all_products(self):
		return self.cds_category.all()
		
	def clean(self):
		r = re.compile('^([a-zA-Z0-9_-]+)\.(jpg|jpeg|png|bmp|gif)$', re.IGNORECASE)
		if self.image:
			if not r.findall(os.path.split(self.image.url)[1]):
				raise ValidationError(_("File name validation error."))

	def save(self, *args, **kwargs):
		self.slug = slugify(self.title)
		super(CategoryCD, self).save(*args, **kwargs)
		
################################################################################################################
################################################################################################################


#Каталог
class CatalogCD(models.Model):
	category = models.ForeignKey(CategoryCD, verbose_name=_('category cd'), related_name='cds_category')
	artist = models.CharField(max_length=500, verbose_name=_("artist"))
	album = models.CharField(max_length=500, verbose_name=_("album"), blank=True)
	label = models.CharField(max_length=500, verbose_name=_("label"), blank=True)
	image = SorlImageField(max_length=500, upload_to='upload/catalogcd/', verbose_name=_('image'), blank=True, null=True)
	country = models.ForeignKey(Country, verbose_name=_('country'), blank=True, null=True)
	text = TinymceField.HTMLField(max_length=100000, verbose_name=_("text"), blank=True)
	cost = models.CharField(max_length=100, verbose_name=_("cost"), blank=True)
	is_active = models.BooleanField(verbose_name=_("is_active"), default=True)
	
	def __unicode__(self):
		return u'#%d - %s' % (self.id,self.artist)
		
	def clean(self):
		r = re.compile('^([a-zA-Z0-9_-]+)\.(jpg|jpeg|png|bmp|gif)$', re.IGNORECASE)
		if self.image:
			if not r.findall(os.path.split(self.image.url)[1]):
				raise ValidationError(_("File name validation error."))
		if self.category:
			if self.category.parent==None:
				raise ValidationError(_("Error. In root categories there can't be goods"))
				
				
	def small_image(self):
		if self.image:
			f = get_thumbnail(self.image, 'x60', crop='center', quality=99, format='PNG')
			html = '<a href="%s"><img src="%s" title="%s" /></a>'
			return html % (self.image.url, f.url, self.artist)
		return u'<img src="/media/img/no_image_min.png" title="%s" />' % self.artist

	small_image.short_description = _("Image")
	small_image.allow_tags = True
		
	@models.permalink
	def get_item_url(self):
		return ('catalogcd_item_url', (), {'id': self.id})
		
	def get_title(self):
		if self.album:
			return u'%s - %s' % (self.artist, self.album)
		return u'%s' % self.artist
	
	def get_category_id(self):
		return self.category.id
	
	def get_artist(self):
		return self.artist
		
	def get_album(self):
		return self.album
		
	def get_label(self):
		return self.label
		
	def get_country(self):
		return self.country
		
	def get_text(self):
		return self.text
		
	def get_image(self):
		return self.image
		
	def get_cost(self):
		return self.cost
		
	def get_q(self):
		q = self.artist[0]
		return '%s' % q
		
	def get_page(self):
		q = self.get_q
		count_page = CatalogCD.objects.filter(is_active=True,artist__startswith=q, artist__lte=self.artist).order_by('artist').count()
		page = (count_page-1)/settings.PAGINATE_BY+1
		return '%s' % page
		
	def get_absolute_url(self):
		return '?cat=%d&q=%s&page=%s&id=%d' % (self.get_category_id(), self.get_q(), self.get_page(), self.id)
		
	class Meta: 
		verbose_name = _("catalog cd") 
		verbose_name_plural = _("catalog cds")
		ordering = ['artist', 'id',]
		
################################################################################################################
################################################################################################################