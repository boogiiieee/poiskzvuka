# -*- coding: utf-8 -*-

from django import forms
from captcha.fields import CaptchaField
from django.utils.translation import ugettext_lazy as _
from django.utils.encoding import force_unicode
from django.utils.safestring import mark_safe
import re

from feedback.models import FeedBackItem

################################################################################################################
################################################################################################################

from django.forms.widgets import Input
from django.forms.util import flatatt

class InputHTML5(Input):
	def __init__(self, attrs={}):
		self.attrs = attrs
		
	def render(self, name, value, attrs=None):
		if value is None:
			value = ''
		if attrs:
			self.attrs.update(attrs)
		final_attrs = self.build_attrs(self.attrs, type=self.input_type, name=name)
		if value != '':
			final_attrs['value'] = force_unicode(self._format_value(value))
		return mark_safe(u'<input%s />' % flatatt(final_attrs))
		
class TextInputHTML5(InputHTML5):
	input_type = 'text'
		
################################################################################################################
################################################################################################################

class FeedBackForm(forms.ModelForm):
	#captcha = CaptchaField()
	
	class Meta:
		model = FeedBackItem
		fields = ('name', 'email', 'phone', 'text')
		widgets = {
			'name': TextInputHTML5({'required':''}),
			'email': TextInputHTML5({'required':''}),
			#'phone': TextInputHTML5({'required':''}),
			'text': forms.Textarea({'required':''}),
		}
		
	def clean_name(self): 
		name = self.cleaned_data['name']
		if len(name) < 3:
			raise forms.ValidationError(_("Invalid name field"))
		return name
		
	def clean_email(self): 
		email = self.cleaned_data['email']
		if email:
			r = re.compile('^[0-9a-zA-Z]+[-\._0-9a-zA-Z]*@[0-9a-zA-Z]+[-\._^0-9a-zA-Z]*[0-9a-zA-Z]+[\.]{1}[a-zA-Z]{2,6}$')
			if not r.findall(email):
				raise forms.ValidationError(_("Invalid email field"))
		return email
		
	def clean_phone(self): 
		phone = self.cleaned_data['phone']
		if phone:
			r = re.compile('^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$')
			if not r.findall(phone):
				raise forms.ValidationError(_("Invalid phone field"))
		return phone
		
	def clean_text(self): 
		text = self.cleaned_data['text']
		if len(text) < 10:
			raise forms.ValidationError(_("Invalid text field"))
		return text
		
################################################################################################################
################################################################################################################