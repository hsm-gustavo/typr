import os

import redis

r = redis.Redis(host="localhost", port=6379, decode_responses=True, password=os.environ["REDIS_PASSWORD"])

folder_path = "./data"

for filename in os.listdir(folder_path):
    if filename.endswith(".txt"):
        category = filename.replace(".txt", "")  # e.g., nouns.txt → nouns
        file_path = os.path.join(folder_path, filename)

        with open(file_path, "r") as file:
            words = [line.strip() for line in file if line.strip()]
            for word in words:
                r.sadd(category, word)

        print(f"✅ Uploaded {len(words)} words to category: {category}")

""" r.delete("determiners")

with open(os.path.join(folder_path, "determiners.txt")) as f:
    for word in f:
        clean = word.strip()
        if clean:
            r.sadd("determiners", clean) """
