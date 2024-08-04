from flask import Flask, request, render_template
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        name = request.form['name']
        mobile = request.form['mobile']
        message = request.form['message']
        
        # Send email
        send_email(name, mobile, message)
        
        return "Form submitted successfully"
    return render_template('index.html')

def send_email(name, mobile, message):
    sender_email = "firstsite883@gmail.com"
    receiver_email = "firstsite883@gmail.com"
    password = "firstsite@88!"  # Use an app-specific password if using Gmail

    # Set up the MIME
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = "New Form Submission"

    body = f"Name: {name}\nMobile: {mobile}\nMessage: {message}"
    msg.attach(MIMEText(body, 'plain'))

    # SMTP server setup
    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()  # Secure the connection
            server.login(sender_email, password)
            text = msg.as_string()
            server.sendmail(sender_email, receiver_email, text)
    except Exception as e:
        print(f"Error sending email: {e}")

if __name__ == '__main__':
    app.run(debug=True)
