from pydoc import cli
import sys
import json
from telethon import TelegramClient, events
from telethon.tl.types import ChannelParticipantsAdmins
from tkinter import *
import asyncio

api_id = 14526833
api_hash = '2c6ba11e318afe05d16c96a3a86a01a7'
client = TelegramClient('chris', api_id, api_hash)

print(sys.argv[1])
print(sys.argv[2])
phone = sys.argv[1]
print(phone)
code = sys.argv[2]
assert client.connect()
if not client.is_user_authorized():
    client.send_code_request(phone)
    
print("im here logging")
@client.on(events.NewMessage(chats="https://t.me/bidaobi"))
async def handler(event):
    adminlist = []
    ignorelist = [259643624, 609517172, 1867070841, 2033561964]  # bots such as rose, calsi etc
    if not adminlist:
        async for user in client.iter_participants("https://t.me/bidaobi", filter=ChannelParticipantsAdmins):
            if user.id not in ignorelist:
                adminlist.append(user.id)

    sender = await event.get_sender()
    try:
        if sender.id in adminlist:
            if "0x" in event.text:
                filterCA = event.text.split()
                #solveCaptchas(filterCA)
            else:
                print("not ca")
    except:
        if "0x" in event.text:
            filterCA = event.text.split()
            #solveCaptchas(filterCA)
        else:
            print("not ca")

print("listening...")

client.run_until_disconnected()
    
    # def solveCaptchas(string):
    #     CA = ''
    #     for i in string:
    #         if "0x" in i:
    #             CA = i
    #             buyToken(CA)
    #             break

    #     if len(i) == 42:
    #         buyToken(CA)
    #     elif len(i) == 69:
    #         buyToken(i.split("tokens/", 1)[1])
