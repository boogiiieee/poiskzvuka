������� ������� Dashboard �� ������� ���� � ������ �������, ����� � �.�.
��� ������ ���������� ����� ������ pymorphy.

1) ����������� ���������� admintrans � ������ �������.
2) ����������� ������� �� ���������� � ����� templates � ����� �������.
3) �������� � settings.py 'admintrans',
4) �������� � dushboard.py:
	class CustomAppIndexDashboard(AppIndexDashboard):
		def __init__(self, *args, **kwargs):
			AppIndexDashboard.__init__(self, *args, **kwargs)

			self.children += [
				modules.ModelList(_(self.app_title), self.models),
5) �������� � init.py ������� ����������:
	# -*- coding: utf-8 -*-
	from django.utils.translation import ugettext_lazy as _
	_('��� ����������')
6) �������� � init.py � ����� �����:
	# -*- coding: utf-8 -*-
	from django.utils.translation import ugettext_lazy as _
	_('Auth')
	_('Sites')
7) �������� � ���� admin.py ���������� from admintrans.admin import *
8) ������� ���� �������� ��� ������� � ����������