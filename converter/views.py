from __future__ import unicode_literals

import oauth2client.file
import youtube_dl
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.generic.base import View
from gmusicapi import Musicmanager
from oauth2client.client import OAuth2WebServerFlow

from ytmp3.settings import oauth


def _check_token(request):
    token = request.GET.get('token', request.POST.get('token', None))
    return get_user_model().objects.filter(token=token).exists()


class TokenView(View):

    def get(self, request, *args, **kwargs):
        return JsonResponse({'response': _check_token(request)})

    def post(self, request, *args, **kwargs):
        user = get_user_model().objects.filter(username=request.POST.get('username', None))
        if user.exists() and user[0].check_password(request.POST.get('password', None)):
            return JsonResponse({'response': True, 'token': user[0].token})
        return JsonResponse({'response': False})


class OAuthView(View):

    def get(self, request, *args, **kwargs):
        if _check_token(request):
            flow = OAuth2WebServerFlow(**oauth._asdict())
            return JsonResponse({'response': True, 'url': flow.step1_get_authorize_url()})
        return JsonResponse({'response': False})

    def post(self, request, *args, **kwargs):
        code = request.POST.get('code', None)
        if _check_token(request):
            flow = OAuth2WebServerFlow(**oauth._asdict())
            flow.step1_get_authorize_url()
            credentials = flow.step2_exchange(code)

            cred = get_user_model().objects.get(token=request.POST['token']).cred
            storage = oauth2client.file.Storage('')
            storage.put(credentials)

            return credentials
        return JsonResponse({'response': False})


class UploadView(View):
    filename = None

    def _my_hook(self, d):
        if d['status'] == 'finished':
            self.filename= d['filename'].split('.')[0] + '.mp3'

    def post(self, request, *args, **kwargs):
        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '320',
            }],
            'progress_hooks': [self._my_hook],
        }

        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            ydl.download(['https://www.youtube.com/watch?v=JylZrg49aXU'])

        if self.filename:
            manager = Musicmanager()
            credential = 'oauth.cred'
            manager.perform_oauth(storage_filepath=credential)
            manager.login(oauth_credentials=credential)
            manager.upload(self.filename)
            print('uploaded')
