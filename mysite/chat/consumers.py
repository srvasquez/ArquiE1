from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.utils import timezone
import json
import requests

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        nameAuthor = text_data_json['name']
        if (message == "Chuck"):
            request = requests.get('https://api.chucknorris.io/jokes/random').json()
            message = request["value"]

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'name': nameAuthor
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']
        nameAuthor = event['name']
        time_send = str(timezone.now().strftime("%x %X"))

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message,
            'name': nameAuthor,
            'time': time_send,
        }))