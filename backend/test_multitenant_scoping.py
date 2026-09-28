import urllib.request
import json

BASE_URL = "http://127.0.0.1:5000/api"

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
    print("--- 1. Login as Ramesh Anugu (Anugu Organic Farms) ---")
    status, ramesh_res = make_request(f"{BASE_URL}/auth/login", "POST", {
        "email": "ramesh@anugufarms.com",
        "password": "password123",
        "role": "farmer"
    })
    assert status == 200, "Ramesh login failed"
    ramesh_token = ramesh_res["token"]
    ramesh_id = ramesh_res["user"]["id"]
    print(f"Ramesh User ID: {ramesh_id}")

    print("\n--- 2. Login as Thirupathi Reddy (Reddy Organic Farms) ---")
    status, thirupathi_res = make_request(f"{BASE_URL}/auth/login", "POST", {
        "email": "thirupathi@reddyfarms.com",
        "password": "password123",
        "role": "farmer"
    })
    assert status == 200, "Thirupathi login failed"
    thirupathi_token = thirupathi_res["token"]
    thirupathi_id = thirupathi_res["user"]["id"]
    print(f"Thirupathi User ID: {thirupathi_id}")

    print("\n--- 3. Query GET /api/products/farmer as Ramesh Anugu ---")
    status, ramesh_prods = make_request(f"{BASE_URL}/products/farmer", "GET", token=ramesh_token)
    assert status == 200, "Ramesh products query failed"
    print(f"Ramesh Product Count: {len(ramesh_prods)}")
    for prod in ramesh_prods:
        print(f" - [{prod['id']}] {prod['name']} (Farmer: {prod['farmer']['name']})")
        assert prod["farmer"]["name"] == "Ramesh Anugu", f"Product {prod['name']} does not belong to Ramesh!"

    print("\n--- 4. Query GET /api/products/farmer as Thirupathi Reddy ---")
    status, thirupathi_prods = make_request(f"{BASE_URL}/products/farmer", "GET", token=thirupathi_token)
    assert status == 200, "Thirupathi products query failed"
    print(f"Thirupathi Product Count: {len(thirupathi_prods)}")
    for prod in thirupathi_prods:
        assert prod["farmer"]["name"] == "Thirupathi Reddy", f"Product {prod['name']} does not belong to Thirupathi!"

    print("\n--- 5. Create New Harvest Listing as Ramesh Anugu ---")
    new_crop = {
        "name": "Organic Chittoor Custard Apples",
        "category": "Fruits",
        "price": 220,
        "originalPrice": 260,
        "unit": "1 kg (approx 4-5 fruits)",
        "description": "Sweet, creamy custard apples harvested fresh from Anugu family orchards."
    }
    status, add_res = make_request(f"{BASE_URL}/products/", "POST", data=new_crop, token=ramesh_token)
    assert status == 201, "Failed to create crop as Ramesh"
    created_prod = add_res["product"]
    print(f"Created Crop ID: {created_prod['id']} - {created_prod['name']}")
    assert created_prod["farmer"]["name"] == "Ramesh Anugu"

    import time
    ts = int(time.time())

    print(f"\n--- 6. Register Fresh Customer & Add Multi-Vendor Items to Cart ---")
    cust_data = {
        "full_name": "Test Order Customer",
        "email": f"cust.{ts}@example.com",
        "password": "password123",
        "role": "customer"
    }
    status, rohan_res = make_request(f"{BASE_URL}/auth/register", "POST", cust_data)
    assert status == 201, "Customer registration failed"
    rohan_token = rohan_res["token"]

    mango_prod = next(p for p in ramesh_prods if "Mangoes" in p["name"])
    turmeric_prod = next(p for p in thirupathi_prods if "Turmeric Powder" in p["name"])

    # Sync cart: Add 2 Mangoes (₹280 x 2 = ₹560) and 1 Turmeric Powder (₹195 x 1 = ₹195)
    make_request(f"{BASE_URL}/cart/", "POST", {"product_id": mango_prod["id"], "quantity": 2}, token=rohan_token)
    make_request(f"{BASE_URL}/cart/", "POST", {"product_id": turmeric_prod["id"], "quantity": 1}, token=rohan_token)

    print("\n--- 7. Place Multi-Vendor Order as Rohan ---")
    status, order_res = make_request(f"{BASE_URL}/orders/", "POST", {
        "deliveryFee": 40,
        "farmerContribution": 20
    }, token=rohan_token)
    assert status == 201, "Place order failed"
    placed_order = order_res["order"]
    print(f"Order Placed ID: {placed_order['id']}, Grand Total: INR {placed_order['grandTotal']}")

    print("\n--- 8. Verify Farmer Summary Scoping for Ramesh Anugu ---")
    status, ramesh_summary = make_request(f"{BASE_URL}/orders/farmer-summary", "GET", token=ramesh_token)
    assert status == 200, "Ramesh summary query failed"
    print(f"Ramesh Total Earnings: INR {ramesh_summary['total_earnings']}")
    print(f"Ramesh Orders Count: {len(ramesh_summary['orders'])}")
    assert ramesh_summary['total_earnings'] == 560, f"Expected 560 for Ramesh, got {ramesh_summary['total_earnings']}"

    print("\n--- 9. Verify Farmer Summary Scoping for Thirupathi Reddy ---")
    status, thirupathi_summary = make_request(f"{BASE_URL}/orders/farmer-summary", "GET", token=thirupathi_token)
    assert status == 200, "Thirupathi summary query failed"
    print(f"Thirupathi Total Earnings: INR {thirupathi_summary['total_earnings']}")
    print(f"Thirupathi Orders Count: {len(thirupathi_summary['orders'])}")
    assert thirupathi_summary['total_earnings'] == 195, f"Expected 195 for Thirupathi, got {thirupathi_summary['total_earnings']}"

    print("\n[SUCCESS] MULTI-TENANT DATA SCOPING AND EARNINGS ISOLATION VERIFIED PERFECTLY!")

if __name__ == "__main__":
    run_tests()
