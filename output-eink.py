import sys
from inky import InkyPHAT
from PIL import Image, ImageFont, ImageDraw
from font_fredoka_one import FredokaOne
from font_source_serif_pro import SourceSerifPro as Serif

import commands

inky_display = InkyPHAT("red")
inky_display.set_border(inky_display.WHITE)

deviceID = sys.argv[1]

img = Image.new("P", ( inky_display.WIDTH,inky_display.HEIGHT ) )
draw = ImageDraw.Draw(img)

message_font = ImageFont.truetype(FredokaOne, 22)
id_font = ImageFont.truetype(Serif, 16)

message = ' '.join(sys.argv[2:])
print(message);

message_w, message_h = message_font.getsize(message)
message_x = ( (inky_display.WIDTH / 2) - (message_w / 2) )
message_y = ( (inky_display.HEIGHT / 2) - (message_h / 2) )

draw.text( ( message_x, message_y), message, inky_display.BLACK, message_font )
draw.text( ( 0, 0 ), deviceID, inky_display.BLACK, id_font )

inky_display.set_image(img)
inky_display.show()
