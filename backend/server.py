from flask import Flask, send_file, request

app = Flask(__name__)
ok_status = 200
json_type = {'ContentType': 'application/json'}

###############
# Basic Serving 
###############
# Get the Network.
@app.route('/network')
def network():
    return ok_status

app.run(debug=True)
