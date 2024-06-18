<h1 align="center" style="font-weight: bold">
  GPT Auth
  <br>
    <h3 align="center">Auth for your Custom GPT</h3>
  <br>
  
</h1>

**GPT Auth** provides a user-friendly solution to quickly setup oauth for your custom GPT and self-host it.

### Tutorial -> https://youtu.be/naJCyASboTk

## Key Features 🎯

- **Robust Security**: Tailored for Custom GPTs, ensuring protection against unauthorized access.
- **Access Control**: Effective monitoring and management of user access by GPT owners.
- **Easy Integration**: User-friendly setup, comprehensive guide, and intuitive dashboard.
- **Community & Support**: Access to a supportive community and dedicated developer support.
- **Interactive Demo & Documentation**: Hands-on demo and extensive documentation available.

### Stack

- Next.js
- OpenAI
- Tailwind
- Flask
- Sqlalchemy

### Run the project locally

Minimum requirements to run the projects locally

- Node.js v18
- OpenAI API Key
- Python3

```shell

## Client

cd client

npm install

npm run build

npm start

## Server

cd ../server

pip install -r requirements.txt

python webserver.py
```

Use ngrok to test on a https endpoint

### Hosted version of GPT Auth

If you don't want to setup locally and wish to use a hosted version, you can start from https://gpt-auth.thesamur.ai/

### Demo

Here is a demo chatgpt plugin built with GPT Auth to test the entire flow of the app https://chat.openai.com/g/g-xx7FJpizE-gpt-auth
