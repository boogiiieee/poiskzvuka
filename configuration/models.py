# -*- coding: utf-8 -*-

from django.db import models
from django.utils.translation import ugettext_lazy as _

#######################################################################################################################
#######################################################################################################################

#Настройки
class ConfigModel(models.Model):
	name1 = models.CharField(max_length=100, verbose_name=_("name 1"), blank=True, help_text=_('red text'))
	name2 = models.CharField(max_length=100, verbose_name=_("name 2"), blank=True, help_text=_('black text'))
	address = models.CharField(max_length=100, verbose_name=_("address"), blank=True)
	email = models.CharField(max_length=100, verbose_name=_("email"), blank=True)
	phone = models.CharField(max_length=100, verbose_name=_("phone"), blank=True)
	footer = models.CharField(max_length=100, verbose_name=_("footer text"), blank=True)
	
	def __unicode__(self):
		return u'%s' % _("configuration")
		
	class Meta: 
		verbose_name = _("configuration") 
		verbose_name_plural = _("configurations")
		
#######################################################################################################################
#######################################################################################################################