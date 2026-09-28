import urllib.request
import json

BASE_URL = "http://127.0.0.1:5000/api/auth"

def make_request(url, method="GET", data=None, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return response.status, json.loads(res_body)
    except urllib.error.HTTPError as e:
        res_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(res_body)
        except Exception:
            return e.code, {"error": res_body}

def run_tests():
    print("--- 1. Testing Login with Seeded Demo Customer (rohan@gmail.com) ---")
    status, res = make_request(f"{BASE_URL}/login", "POST", {
        "email": "rohan@gmail.com",
        "password": "password123",
        "role": "customer"
    })
    print(f"Status: {status}")
    print(f"Response: {json.dumps(res, indent=2)}")
    if status != 200:
        print("LOGIN FAILED RESPONSE:", res)
    assert status == 200, f"Seeded customer login failed with status {status}"
    rohan_token = res["token"]

    print("\n--- 2. Testing Login with Seeded Demo Farmer (ramesh@anugufarms.com) ---")
    status, res = make_request(f"{BASE_URL}/login", "POST", {
        "email": "ramesh@anugufarms.com",
        "password": "password123",
        "role": "farmer"
    })
    print(f"Status: {status}")
    print(f"Response: {json.dumps(res, indent=2)}")
    assert status == 200, "Seeded farmer login failed"
    assert res["user"]["farm_name"] == "Anugu Organic Farms"

    print("\n--- 3. Testing GET /api/auth/me with Bearer Token ---")
    status, res = make_request(f"{BASE_URL}/me", "GET", token=rohan_token)
    print(f"Status: {status}")
    print(f"Response: {json.dumps(res, indent=2)}")
    assert status == 200, "GET /api/auth/me failed"
    assert res["user"]["email"] == "rohan@gmail.com"

    import time
    ts = int(time.time())

    print("\n--- 4. Testing Register New Customer ---")
    new_customer_data = {
        "full_name": "Sahithi Reddy",
        "email": f"sahithi.{ts}@example.com",
        "password": "securepassword123",
        "role": "customer",
        "phone": "+91 98765 00000",
        "address": "Banjara Hills, Hyderabad"
    }
    status, res = make_request(f"{BASE_URL}/register", "POST", new_customer_data)
    print(f"Status: {status}")
    print(f"Response: {json.dumps(res, indent=2)}")
    assert status == 201, "New customer registration failed"
    new_cust_token = res["token"]

    print("\n--- 5. Testing Register New Farmer ---")
    new_farmer_data = {
        "name": "Venkat Rao",
        "email": f"venkat.{ts}@greenfields.com",
        "password": "farmpassword123",
        "role": "farmer",
        "farm_name": "GreenFields Organic Hub",
        "location": "Guntur, Andhra Pradesh",
        "farm_story": "Cultivating organic spices and seasonal pulses."
    }
    status, res = make_request(f"{BASE_URL}/register", "POST", new_farmer_data)
    print(f"Status: {status}")
    print(f"Response: {json.dumps(res, indent=2)}")
    assert status == 201, "New farmer registration failed"
    assert res["user"]["farm_name"] == "GreenFields Organic Hub"
    assert res["user"]["location"] == "Guntur, Andhra Pradesh"

    print("\n--- 6. Testing Login for Newly Registered Customer ---")
    status, res = make_request(f"{BASE_URL}/login", "POST", {
        "email": f"sahithi.{ts}@example.com",
        "password": "securepassword123"
    })
    print(f"Status: {status}")
    print(f"Response: {json.dumps(res, indent=2)}")
    assert status == 200, "Newly registered customer login failed"
    assert res["user"]["name"] == "Sahithi Reddy"

    print("\n[SUCCESS] ALL AUTHENTICATION AND MULTI-TENANT USER TESTS PASSED PERFECTLY!")

if __name__ == "__main__":
    run_tests()
