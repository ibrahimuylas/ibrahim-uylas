const subjectOptions = [
  ['Rota veya kamp sorusu', 'Route or camping question'],
  ['Ekipman önerisi', 'Gear suggestion'],
  ['İş birliği', 'Working together'],
  ['Site hakkında', 'About the website'],
  ['Sadece merhaba', 'Just saying hello'],
  ['Diğer', 'Other']
]

const contact = {
  tr: {
    title: 'İletişim',
    description:
      'Rotalar, kamp, ekipmanlar, iş birlikleri veya sadece merhaba demek için İbrahim Uylaş’a ulaş.',
    heading: 'Aklında bir şey varsa, konuşalım.',
    intro:
      'Bir rota sorusu, ekipman fikri, iş birliği teklifi ya da sadece bir merhaba… Konu ne olursa olsun aşağıdaki formdan yazabilirsin.',
    honeypot: 'Bu alanı boş bırak',
    name: 'Adın',
    namePlaceholder: 'Nasıl hitap edeyim?',
    nameRequired: 'Lütfen adını yaz.',
    email: 'E-posta adresin',
    emailPlaceholder: 'sen@ornek.com',
    emailRequired: 'Lütfen e-posta adresini yaz.',
    emailInvalid: 'Lütfen geçerli bir e-posta adresi yaz.',
    subject: 'Ne hakkında yazıyorsun?',
    subjectPrompt: 'Bir konu seç',
    subjectRequired: 'Lütfen bir konu seç.',
    message: 'Mesajın',
    messagePlaceholder:
      'Aklındakini anlat, mümkün olduğunca kısa sürede dönüş yapayım.',
    messageRequired: 'Lütfen mesajını yaz.',
    messageTooShort: 'Mesajın en az 10 karakter olmalı.',
    privacy: 'Bilgilerini yalnızca sana dönüş yapmak için kullanırım.',
    submitting: 'Gönderiliyor',
    submit: 'Mesajı gönder',
    success: 'Mesajın ulaştı. Teşekkür ederim, en kısa sürede dönüş yapacağım.',
    error:
      'Mesaj gönderilemedi. Lütfen tekrar dene veya doğrudan ibrahim@uylas.net’e e-posta gönder.'
  },
  en: {
    title: 'Contact',
    description:
      'Get in touch with İbrahim Uylaş about routes, camping, gear, working together or just to say hello.',
    heading: 'Something on your mind? Let’s talk.',
    intro:
      'Got a question about a route, an idea about gear or a project we could work on together? Use the form below to drop me a line, even if it’s just to say hello.',
    honeypot: 'Leave this field empty',
    name: 'Your name',
    namePlaceholder: 'What should I call you?',
    nameRequired: 'Enter your name.',
    email: 'Your email address',
    emailPlaceholder: 'you@example.com',
    emailRequired: 'Enter your email address.',
    emailInvalid: 'Enter a valid email address.',
    subject: 'What are you writing about?',
    subjectPrompt: 'Choose a topic',
    subjectRequired: 'Choose a topic.',
    message: 'Your message',
    messagePlaceholder:
      'Tell me what’s on your mind and I’ll get back to you as soon as I can.',
    messageRequired: 'Enter your message.',
    messageTooShort: 'Your message must be at least 10 characters long.',
    privacy: 'I’ll only use your details to reply to your message.',
    submitting: 'Sending',
    submit: 'Send message',
    success: 'Thanks for your message. I’ll get back to you as soon as I can.',
    error:
      'Your message couldn’t be sent. Try again or email me at ibrahim@uylas.net.'
  }
}

module.exports = { contact, subjectOptions }
