from flask import Flask, request, jsonify
import requests
import concurrent.futures
import time

app = Flask(__name__)

def fetch_numbers_from_url(url):
    try:
        response = requests.get(url, timeout=2)
        response.raise_for_status()  # Check for HTTP errors
        data = response.json()
        if "numbers" in data:
            return data["numbers"]
        else:
            return {"error": "No 'numbers' field found in response"}
    except requests.exceptions.RequestException as e:
        return {"error": f"Error fetching data from {url}: {str(e)}"}
    except Exception as e:
        return {"error": str(e)}

def merge_and_sort_numbers(number_lists):
    merged_numbers = set()
    for numbers in number_lists:
        merged_numbers.update(numbers)
    return sorted(merged_numbers)

@app.route('/numbers', methods=['GET'])
def get_numbers():
    urls = request.args.getlist('url')

    number_lists = []
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [executor.submit(fetch_numbers_from_url, url) for url in urls]
        for future in concurrent.futures.as_completed(futures, timeout=0.5):
            try:
                numbers = future.result()
                if "error" not in numbers:
                    number_lists.append(numbers)
                else:
                    app.logger.error(numbers["error"])  # Log the error
            except Exception as e:
                app.logger.error(f"Error processing future: {str(e)}")

    merged_numbers = merge_and_sort_numbers(number_lists)

    return jsonify(numbers=merged_numbers)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8008)
