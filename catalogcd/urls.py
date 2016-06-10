from django.conf.urls.defaults import *

urlpatterns = patterns('catalogcd.views',
	url(r'^catalog/$', 'catalog'),
	url(r'^contacts/$', 'contacts'),
)