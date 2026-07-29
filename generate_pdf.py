import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748b"))
        # Header line & text
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(36, 756, 576, 756)
        self.drawString(36, 762, "Langsphere AI — Technical Architecture & Speech System Specification")
        
        # Footer
        self.line(36, 45, 576, 45)
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(576, 30, page_text)
        self.drawString(36, 30, "Confidential — For Internal & Development Use")
        self.restoreState()

def build_pdf(filename, artifact_filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#ffffff'),
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#e0e7ff'),
        spaceAfter=10
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#c7d2fe')
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=16,
        spaceAfter=10,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1e1b4b'),
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#0f172a'),
        backColor=colors.HexColor('#f1f5f9'),
        borderColor=colors.HexColor('#cbd5e1'),
        borderWidth=1,
        borderPadding=8,
        spaceBefore=6,
        spaceAfter=8
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.HexColor('#0f172a')
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#334155')
    )

    story = []

    # Title Banner Container Table
    banner_data = [[
        Paragraph("Langsphere AI", title_style),
    ], [
        Paragraph("Technical Architecture & Speech / Voice System Specification", subtitle_style),
    ], [
        Paragraph("<b>Platform:</b> React Native & Expo (v56) &nbsp;|&nbsp; <b>Target Languages:</b> Indic (Tamil, Hindi, Telugu, Malayalam, Kannada) & Global", meta_style)
    ]]
    
    banner_table = Table(banner_data, colWidths=[540])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#4338ca')),
        ('PADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,-1), (-1,-1), 14),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('CORNERPAD', (0,0), (-1,-1), 0),
    ]))
    
    story.append(banner_table)
    story.append(Spacer(1, 14))

    # Section 1
    story.append(Paragraph("1. Executive Summary & Core Platform Overview", h1_style))
    story.append(Paragraph(
        "<b>Langsphere AI</b> is an interactive educational platform designed to teach children Indic languages (Tamil, Hindi, Telugu, Malayalam, Kannada) and international languages. The application integrates dynamic Generative AI lesson creation, interactive tracing canvases, gamified XP progression, real-time voice recording/pronunciation analysis, and parent monitoring capabilities.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # Section 2 - Tech Stack Matrix Table
    story.append(Paragraph("2. Complete Technical Stack Matrix", h1_style))
    
    matrix_headers = [
        Paragraph("Category", table_header_style),
        Paragraph("Technologies & Libraries", table_header_style),
        Paragraph("Version", table_header_style),
        Paragraph("Role & Key Responsibilities", table_header_style)
    ]

    matrix_rows = [
        [
            Paragraph("<b>Frontend Framework</b>", table_cell_style),
            Paragraph("React Native, Expo", table_cell_style),
            Paragraph("0.85.3 / 56.0.3", table_cell_style),
            Paragraph("Cross-platform runtime engine for Android, iOS, and Web targets.", table_cell_style)
        ],
        [
            Paragraph("<b>Router & Navigation</b>", table_cell_style),
            Paragraph("expo-router", table_cell_style),
            Paragraph("56.2.5", table_cell_style),
            Paragraph("File-based routing with tab bar, stack navigation, and route guards.", table_cell_style)
        ],
        [
            Paragraph("<b>UI & Styling</b>", table_cell_style),
            Paragraph("NativeWind, Tailwind CSS", table_cell_style),
            Paragraph("4.2.4 / 3.3.2", table_cell_style),
            Paragraph("Utility-first styling system for consistent component design tokens.", table_cell_style)
        ],
        [
            Paragraph("<b>Animations & 3D</b>", table_cell_style),
            Paragraph("Reanimated, Three.js, R3F", table_cell_style),
            Paragraph("4.3.1 / 0.184.0", table_cell_style),
            Paragraph("60 FPS micro-animations, particle effects, and 3D mascot rendering.", table_cell_style)
        ],
        [
            Paragraph("<b>Generative AI Engine</b>", table_cell_style),
            Paragraph("@google/generative-ai", table_cell_style),
            Paragraph("0.24.1", table_cell_style),
            Paragraph("Powers <i>gemini-flash-lite-latest</i> for dynamic placement tests, AI stories, and chatbot mascot.", table_cell_style)
        ],
        [
            Paragraph("<b>Backend & Auth</b>", table_cell_style),
            Paragraph("Firebase Auth & Firestore, Express", table_cell_style),
            Paragraph("12.13.0 / 5.2.1", table_cell_style),
            Paragraph("User login, streak tracking, parent dashboard, and custom Node API endpoints.", table_cell_style)
        ],
        [
            Paragraph("<b>Voice Output (TTS)</b>", table_cell_style),
            Paragraph("expo-speech, Web SpeechSynthesizer, Google TTS", table_cell_style),
            Paragraph("56.0.3", table_cell_style),
            Paragraph("Multi-tier text-to-speech output with audio stream fallback.", table_cell_style)
        ],
        [
            Paragraph("<b>Voice Input (STT)</b>", table_cell_style),
            Paragraph("Web Speech API (webkitSpeechRecognition)", table_cell_style),
            Paragraph("Native Web", table_cell_style),
            Paragraph("Real-time microphone capture, Indic Unicode regex filtering, and pronunciation scoring.", table_cell_style)
        ]
    ]

    t_data = [matrix_headers] + matrix_rows
    col_widths = [110, 130, 75, 225]
    
    stack_table = Table(t_data, colWidths=col_widths)
    stack_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
    ]))

    story.append(stack_table)
    story.append(Spacer(1, 14))

    # Page Break for Deep Dive
    story.append(PageBreak())

    # Section 3 - Voice & Speech Deep Dive
    story.append(Paragraph("3. Deep Dive: Voice & Speech System Architecture", h1_style))
    story.append(Paragraph(
        "The voice ecosystem in Langsphere AI is built around two key pipelines: <b>Text-to-Speech (TTS)</b> for natural audio narration and <b>Speech-to-Text (STT)</b> for user voice recording and pronunciation evaluation.",
        body_style
    ))

    story.append(Paragraph("A. Text-to-Speech (TTS) — Audio Output Engine", h2_style))
    story.append(Paragraph(
        "Location: <font face='Courier'>utils/speech.ts</font><br/>"
        "The system maps internal language identifiers to standard BCP-47 codes:",
        body_style
    ))
    
    story.append(Paragraph("• <b>Tamil:</b> <font face='Courier'>ta-IN</font> &nbsp;&nbsp;|&nbsp;&nbsp; <b>Hindi:</b> <font face='Courier'>hi-IN</font> &nbsp;&nbsp;|&nbsp;&nbsp; <b>Telugu:</b> <font face='Courier'>te-IN</font>", bullet_style))
    story.append(Paragraph("• <b>Malayalam:</b> <font face='Courier'>ml-IN</font> &nbsp;&nbsp;|&nbsp;&nbsp; <b>Kannada:</b> <font face='Courier'>kn-IN</font> &nbsp;&nbsp;|&nbsp;&nbsp; <b>English:</b> <font face='Courier'>en-US</font>", bullet_style))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>3-Tier Execution Strategy:</b>", body_style))
    story.append(Paragraph("1. <b>Tier 1 (Mobile Native):</b> Invokes <font face='Courier'>Speech.speak(text, { language: langCode, rate: 0.85 })</font> using Expo Speech. Speed is calibrated to 0.85 for language learners.", bullet_style))
    story.append(Paragraph("2. <b>Tier 2 (Browser Native):</b> On Web platforms, checks <font face='Courier'>window.speechSynthesis</font> for an installed native voice matching the language prefix (e.g. <font face='Courier'>ta</font> or <font face='Courier'>hi</font>).", bullet_style))
    story.append(Paragraph("3. <b>Tier 3 (Cloud Fallback):</b> If native engines lack voice packs for regional Indic scripts, constructs an audio stream URL and plays it via Web Audio API (<font face='Courier'>new window.Audio(url).play()</font>):", bullet_style))

    story.append(Paragraph(
        "https://translate.google.com/translate_tts?ie=UTF-8&q={TEXT}&tl={LANG}&client=tw-ob",
        code_style
    ))

    story.append(Spacer(1, 10))

    story.append(Paragraph("B. Speech-to-Text (STT) & Pronunciation Evaluation", h2_style))
    story.append(Paragraph(
        "Location: <font face='Courier'>components/practice/VoiceRecordingUI.tsx</font> & <font face='Courier'>app/game-pronounce.tsx</font><br/>"
        "Voice input processing relies on real-time browser microphone streaming combined with Indic Unicode character filtering:",
        body_style
    ))

    story.append(Paragraph("1. <b>Microphone Stream Capture:</b> Instantiates <font face='Courier'>window.webkitSpeechRecognition</font> configured with continuous listening and interim result streaming.", bullet_style))
    story.append(Paragraph("2. <b>Indic Unicode Regex Sanitization:</b> To process complex scripts accurately, non-alphanumeric noise is removed while retaining specific South Asian script ranges:", bullet_style))

    story.append(Paragraph(
        "// Unicode script ranges: Tamil (\\u0B80-\\u0BFF), Hindi (\\u0900-\\u097F), Telugu (\\u0C00-\\u0C7F)\n"
        "const cleanSpoken = currentTranscript.toLowerCase().replace(\n"
        "  /[^\\w\\s\\u0B80-\\u0BFF\\u0900-\\u097F\\u0C00-\\u0C7F\\u0D00-\\u0D7F\\u0C80-\\u0CFF]/g, ' '\n"
        ");",
        code_style
    ))

    story.append(Paragraph("3. <b>Accuracy Match Scoring:</b> Spoken word tokens are checked against target phrase tokens. Matches trigger live UI highlighting and compute an overall accuracy percentage.", bullet_style))

    story.append(Spacer(1, 12))

    # Section 4 - Module Integration Table
    story.append(Paragraph("4. Feature & Module Integration Matrix", h1_style))
    
    mod_headers = [
        Paragraph("Module / Screen", table_header_style),
        Paragraph("Primary Source Path", table_header_style),
        Paragraph("Voice & Speech Integration Mechanism", table_header_style)
    ]

    mod_rows = [
        [
            Paragraph("<b>Pronunciation Game</b>", table_cell_style),
            Paragraph("app/game-pronounce.tsx", table_cell_style),
            Paragraph("STT microphone stream, token matching, accuracy score rendering.", table_cell_style)
        ],
        [
            Paragraph("<b>Vocabulary Flashcards</b>", table_cell_style),
            Paragraph("components/practice/VoiceRecordingUI.tsx", table_cell_style),
            Paragraph("TTS audio demonstration + interactive STT pronunciation test.", table_cell_style)
        ],
        [
            Paragraph("<b>AI Mascot Chatbot</b>", table_cell_style),
            Paragraph("utils/ai.ts", table_cell_style),
            Paragraph("Gemini AI text answers rendered into audible mascot speech via TTS.", table_cell_style)
        ],
        [
            Paragraph("<b>Reading Comprehension</b>", table_cell_style),
            Paragraph("utils/stories.ts", table_cell_style),
            Paragraph("AI story generator with automated paragraph-by-paragraph TTS narration.", table_cell_style)
        ]
    ]

    mod_table = Table([mod_headers] + mod_rows, colWidths=[140, 150, 250])
    mod_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
    ]))

    story.append(mod_table)

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    
    # Also copy to artifact path
    if artifact_filename:
        import shutil
        shutil.copyfile(filename, artifact_filename)

if __name__ == '__main__':
    pdf_out = r"c:\Users\dines\Downloads\Deebak Client\Langsphere_AI_TechStack_Speech_Architecture.pdf"
    artifact_out = r"C:\Users\dines\.gemini\antigravity-ide\brain\1ecb6889-5cc3-48ce-a551-d041d3d38cc5\Langsphere_AI_TechStack_Speech_Architecture.pdf"
    build_pdf(pdf_out, artifact_out)
    print("PDF Successfully Generated at:", pdf_out)
