db = db.getSiblingDB("crosswalks");

db.createCollection("users");

db.users.insertOne({
	"username": "admin",
  	"password": "$2a$10$z2p7uM00h5j7LYWOmcalx.YeY3cyrAdi4H8BljvNYp2JWf2IqsI/y",
  	"email": "admin@crosswalks.com",
  	"fullname": "Administrator",
});