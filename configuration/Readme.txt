��������� � ������� ������ ������������ �����.

1) settings - 'configuration',
2) url - url(r'^configuration', include('configuration.urls')),
3) syncdb
4) dushboard.py - 
	from configuration.views import ConfigModule
	self.children.append(ConfigModule())