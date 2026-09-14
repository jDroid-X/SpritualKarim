from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import landscape
from reportlab.pdfbase.pdfmetrics import stringWidth

OUT = 'output/pdf/spiritual-karim-customer-workflow.pdf'
W, H = 1280, 720

INK = HexColor('#1E293B'); MUTED = HexColor('#64748B'); LINE = HexColor('#CBD5E1')
BG = HexColor('#F8FAFC'); GOLD = HexColor('#D6A735'); PURPLE = HexColor('#7C3AED')
TEAL = HexColor('#0F9E9A'); BLUE = HexColor('#2563EB'); GREEN = HexColor('#16A34A')
ORANGE = HexColor('#EA580C'); ROSE = HexColor('#E11D48'); AMBER = HexColor('#D97706')

def text(c, x, y, s, size=10, color=INK, font='Helvetica', align='left'):
    c.setFont(font, size); c.setFillColor(color)
    if align == 'center': x -= stringWidth(s, font, size) / 2
    elif align == 'right': x -= stringWidth(s, font, size)
    c.drawString(x, y, s)

def wrap(c, x, y, lines, size=8.5, color=MUTED, leading=11, align='left'):
    for i, line in enumerate(lines): text(c, x, y-i*leading, line, size, color, 'Helvetica', align)

def card(c, x, y, w, h, title, bullets, color, number=None):
    c.setFillColor(white); c.setStrokeColor(color); c.setLineWidth(1.1)
    c.roundRect(x, y, w, h, 11, fill=1, stroke=1)
    c.setFillColor(color); c.roundRect(x, y+h-8, w, 8, 8, fill=1, stroke=0)
    if number:
        c.setFillColor(color); c.circle(x+20, y+h-23, 12, fill=1, stroke=0)
        text(c, x+20, y+h-27, str(number), 9, white, 'Helvetica-Bold', 'center')
        title_x=x+39
    else: title_x=x+14
    text(c, title_x, y+h-28, title, 10, INK, 'Helvetica-Bold')
    yy=y+h-47
    for b in bullets:
        c.setFillColor(color); c.circle(x+16, yy+2, 1.5, fill=1, stroke=0)
        text(c, x+22, yy-1, b, 8, MUTED)
        yy-=13

def arrow(c, x1,y1,x2,y2,color=GOLD,dashed=False,label=None):
    c.setStrokeColor(color); c.setFillColor(color); c.setLineWidth(1.7)
    if dashed: c.setDash(4,3)
    c.line(x1,y1,x2,y2); c.setDash()
    # arrow head
    import math
    a=math.atan2(y2-y1,x2-x1); l=8
    c.line(x2,y2,x2-l*math.cos(a-.45),y2-l*math.sin(a-.45))
    c.line(x2,y2,x2-l*math.cos(a+.45),y2-l*math.sin(a+.45))
    if label: text(c,(x1+x2)/2,(y1+y2)/2+5,label,7,color,'Helvetica-Bold','center')

def pill(c, x, y, w, label, color):
    c.setFillColor(HexColor('#FFFFFF')); c.setStrokeColor(color); c.setLineWidth(.8)
    c.roundRect(x,y,w,20,10,fill=1,stroke=1); text(c,x+w/2,y+6,label,7.4,color,'Helvetica-Bold','center')

c=canvas.Canvas(OUT, pagesize=(W,H)); c.setTitle('Spiritual Karim Customer Workflow')
c.setFillColor(BG); c.rect(0,0,W,H,fill=1,stroke=0)
# Header
c.setFillColor(HexColor('#0F172A')); c.rect(0,650,W,70,fill=1,stroke=0)
text(c, 55, 687, 'SHREE SPRITUAL KARIM SANSTHAN', 21, white, 'Helvetica-Bold')
text(c, 55, 668, 'Customer workflow overview - from first enquiry to a guided healer network', 10, HexColor('#CBD5E1'))
pill(c, 975, 678, 105, 'Web + Android', HexColor('#5EEAD4'))
pill(c, 1090, 678, 125, 'Secure role access', HexColor('#C4B5FD'))

# Journey frame
text(c, 55, 625, '1  Guided participant journey', 12, INK, 'Helvetica-Bold')
text(c, 1225, 625, 'The main path a seeker experiences', 8, MUTED, 'Helvetica', 'right')
cards=[
 (55,450,145,135,'Discover & Connect',['Public site or Android app','Referral, mentor or QR link'],ROSE,1),
 (225,450,145,135,'Verify & Enrol',['Sponsor / mentor reference','PIN or consent confirmation'],ORANGE,2),
 (395,450,145,135,'Build Foundation',['Personal profile','Ancestral lineage details'],BLUE,3),
 (565,450,145,135,'Practice & Track',['House Clean progress','Sadhana and remedy plan'],TEAL,4),
 (735,450,145,135,'Grow in Guidance',['Trainee milestones','Mentor-reviewed progress'],AMBER,5),
 (905,450,145,135,'Serve & Guide',['Healer certification','Support a connected network'],GREEN,6),
]
for args in cards: card(c,*args)
for i in range(5): arrow(c,200+i*170,517,225+i*170,517,GOLD)
text(c, 55, 428, 'Alternative entry routes', 9, MUTED, 'Helvetica-Bold')
pill(c,210,418,150,'Self-registration wizard',ROSE); pill(c,375,418,145,'Admin-created profile',PURPLE); pill(c,535,418,145,'Mentor pairing invite',TEAL)
arrow(c,285,418,285,392,LINE,True); arrow(c,447,418,447,392,LINE,True); arrow(c,607,418,607,392,LINE,True)

# Operating model
text(c, 55, 382, '2  Role-specific portals and capabilities', 12, INK, 'Helvetica-Bold')
text(c, 55, 365, 'Each participant sees only the tools and information relevant to their role.', 8.5, MUTED)
portal=[
 (55,245,190,98,'PUBLIC / SEEKER',['Join, learn, find a healer','Start registration'],ROSE),
 (275,245,190,98,'DEVOTEE',['Personal identity and lineage','House Clean status'],BLUE),
 (495,245,190,98,'TRAINEE SADHAK',['Practice plan and milestones','Guided progress'],AMBER),
 (715,245,190,98,'HEALER',['Mentor network and invites','Support devotee journey'],GREEN),
 (935,245,190,98,'MASTER / ADMIN',['Profiles, settings, RBAC','Platform oversight'],PURPLE),
]
for x,y,w,h,t,b,col in portal: card(c,x,y,w,h,t,b,col)
for i in range(4): arrow(c,245+i*220,294,275+i*220,294,HexColor('#94A3B8'))

# central / data middle
text(c, 55, 207, '3  Trusted platform foundation', 12, INK, 'Helvetica-Bold')
card(c,55,70,260,115,'Profile & Journey Record',['Profile, sponsor and reference code','Lineage, practices and milestones'],BLUE)
card(c,375,70,260,115,'Guidance & Governance',['Role-based access and visibility','Validation, approvals and audit trail'],PURPLE)
card(c,695,70,260,115,'Reliable Synchronisation',['Browser data + Firebase realtime sync','Cross-device continuity and backups'],TEAL)
card(c,1015,70,210,115,'Customer outcomes',['Secure guided journey','Visible progress and network growth'],GOLD)
arrow(c,315,127,375,127,GOLD,label='secured by'); arrow(c,635,127,695,127,GOLD,label='kept current by'); arrow(c,955,127,1015,127,GOLD,label='enables')

# vertical relationships
arrow(c,110,245,110,185,BLUE,True,'records'); arrow(c,805,245,805,185,GREEN,True,'updates')
arrow(c,1030,450,1030,343,GREEN,True,'becomes')

# legend / footer
c.setFillColor(HexColor('#E2E8F0')); c.rect(0,0,W,42,fill=1,stroke=0)
text(c,55,16,'Legend:',8,INK,'Helvetica-Bold')
for x,label,col in [(105,'Participant journey',GOLD),(265,'Portal capability',BLUE),(405,'Platform foundation',PURPLE),(560,'Dotted: data/status flow',HexColor('#94A3B8'))]:
    c.setFillColor(col); c.circle(x,20,4,fill=1,stroke=0); text(c,x+9,16,label,7.5,MUTED)
text(c,1225,16,'Source: current web platform code and platform overview',7.5,MUTED,'Helvetica','right')
c.showPage(); c.save()
