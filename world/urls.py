from django.urls import path, include
from .views import *

urlpatterns = [
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('register/', user_register, name='register'),

    path('', world, name='world'),
    path('update_location/', update_location, name="update_location"),
    path('create_marker/', create_marker, name="create_marker"),

    # path('', include('pwa.urls')),  # You MUST use an empty string as the URL prefix,
]