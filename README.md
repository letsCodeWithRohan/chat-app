<h1>chat-app</h1>

<h3>This is a Chat Application Project made with Node.js (expressjs) with real-time communication </h3>

<h3>Folder Structure</h3>
<pre>
Chat-App
|--config
  |-db.js
|--controllers
  |-auth.controller.js
|--middlewares
  |-middleware.js
|--public
  |--stylesheets
  |--javascripts
  |--images
|--routes
  |-auth.route.js
|--views
  |-index.ejs
  |-login.ejs
  |-signup.ejs
  |-profile.ejs
  |-edit-profile.ejs
|-.env
|-index.js
|-package.json
|-package-lock.json
|-README.md
</pre>

<h3>API references</h3>
<a href="https://www.dicebear.com/" target="_blank">Dicebear</a>

## Setup

<h4>Step-1</h4>
<p>Download or clone repository in your computer</p>

<h4>Step-2</h4>
<p>Install dependencies</p>

```bash
npm install
```

<h4>Step-3</h4>
<p>Rename <code>.env.sample</code> file to <kbd>.env</kbd></p>
<p>Add your own <mark>Environment Variables</mark></p>

<h4>Step-4</h4>
<p>SQL Setup</p>

```SQL
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT,
    image VARCHAR(255),
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Only one type of message allowed: TEXT or IMAGE
    CHECK (
        (message IS NOT NULL AND image IS NULL) OR
        (message IS NULL AND image IS NOT NULL)
    ),

    -- Foreign key constraints
    CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

```

<h4>Step-4</h4>
<p>Run Project</p>

```bash
npm run start
```

<h4>Step-5</h4>
<p>Start Development</p>

```bash
npm run dev
```