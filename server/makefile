run:
	npm run dev
db_up:
	docker run --name mongodb_1 -d -p 27017:27017 mongo
db_down:
	docker stop mongodb_1
	docker rm mongodb_1