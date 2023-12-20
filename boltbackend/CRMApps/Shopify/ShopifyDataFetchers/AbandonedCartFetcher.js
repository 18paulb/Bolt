
// async function fetchAbandonedCheckouts() {
//  try {
//   const response = await shopify.get('/admin/api/2023-01/checkouts.json');
//   return response.data.checkouts; // or however the data is structured in the response
//  } catch (error) {
//   console.error('Error fetching abandoned checkouts:', error);
//  }
// }


// TODO: Eventually this will be replaced with a call to grab abandoned shopping cart data from Shopify
export function getAbandonedCarts() {
    return [
        {
            "name": "Shoes",
            "price": 12,
            "image": 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsX29mZmljZV8yNV9waG90b19vZl93aGl0ZV9tYWxlX3RzaGlydF9tb2NrdXBfd2hpdGVfdHNoaV85YjNmOWZjZS03MTZkLTQxYmUtODkzZS05MzkwZWY1NmZiZmFfMi5qcGc.jpg',
            "cartUrl": "https://www.google.com/"
        },
        {
            "name": "T-Shirt",
            "price": 34,
            "image": "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsX29mZmljZV8yNV9waG90b19vZl93aGl0ZV9tYWxlX3RzaGlydF9tb2NrdXBfd2hpdGVfdHNoaV85YjNmOWZjZS03MTZkLTQxYmUtODkzZS05MzkwZWY1NmZiZmFfMi5qcGc.jpg",
            "cartUrl": "https://www.google.com/"
        },
        {
            "name": "Necklace",
            "price": 102,
            "image": "https://t3.ftcdn.net/jpg/04/14/59/14/360_F_414591428_9pRZqRIygbSDvTMvln3v0Ls3vuR09nv8.jpg",
            "cartUrl": "https://www.google.com/"
        },
        {
            "name": "Pants",
            "price": 45,
            "image": "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsX29mZmljZV8yNV9waG90b19vZl93aGl0ZV9tYWxlX3RzaGlydF9tb2NrdXBfd2hpdGVfdHNoaV85YjNmOWZjZS03MTZkLTQxYmUtODkzZS05MzkwZWY1NmZiZmFfMi5qcGc.jpg",
            "cartUrl": "https://www.google.com/xx"
        }
    ]
}


// This is what the data from abandoned carts from shopify should look like
// https://shopify.dev/docs/api/admin-rest/2023-10/resources/abandoned-checkouts
/**
 {
 "abandoned_checkout_url": "https://www.snowdevil.ca/14168/checkouts/0123456789abcdef0456456789abcdef/recover?key=6dacd6065bb80268bda857ee",
 "billing_address": {
 "address1": "Chestnut Street 92",
 "address2": "",
 "city": "Louisville",
 "company": null,
 "country": "United States",
 "country_code": "US",
 "default": true,
 "first_name": "Greg",
 "id": 207119551,
 "last_name": "Piotrowski",
 "name": "Greg Piotrowski",
 "phone": "555-625-1199",
 "province": "Kentucky",
 "province_code": "KY",
 "zip": "40202"
 },
 "buyer_accepts_marketing": false,
 "buyer_accepts_sms_marketing": false,
 "cart_token": "0123456789abcdef0456456789abcdef",
 "closed_at": null,
 "completed_at": null,
 "created_at": "2008-01-10T11:00:00-05:00",
 "currency": {
 "currency": "USD"
 },
 "customer": {
 "accepts_marketing": false,
 "created_at": "2012-03-13T16:09:55-04:00",
 "email": "bob.norman@mail.example.com",
 "first_name": "Bob",
 "id": 207119551,
 "last_name": "Norman",
 "note": null,
 "orders_count": "0",
 "state": null,
 "total_spent": "0.00",
 "updated_at": "2012-03-13T16:09:55-04:00",
 "tags": "tagcity"
 },
 "customer_locale": "fr",
 "device_id": 1,
 "discount_codes": [
 {
 "discount_code": {
 "id": 507328175,
 "code": "WINTERSALE20OFF",
 "usage_count": 0,
 "created_at": "2017-09-25T19:32:28-04:00",
 "updated_at": "2017-09-25T19:32:28-04:00"
 }
 }
 ],
 "email": "bob.norman@mail.example.com",
 "gateway": "authorize_net",
 "id": 450789469,
 "landing_site": "http://www.example.com?source=abc",
 "line_items": {
 "fulfillment_service": "manual",
 "grams": 400,
 "price": "214.00",
 "product_id": 431300801,
 "quantity": 4,
 "requires_shipping": true,
 "sku": "SKU123",
 "title": "Jib",
 "variant_id": 233402193,
 "variant_title": "Green",
 "vendor": "Ottawa Sail Shop"
 },
 "location_id": 1,
 "note": null,
 "phone": {
 "phone": "+13125551212"
 },
 "presentment_currency": {
 "presentment_currency": "USD"
 },
 "referring_site": "http://www.anexample.com",
 "shipping_address": {
 "address1": "Chestnut Street 92",
 "address2": "Apt 2",
 "city": "Louisville",
 "company": null,
 "country": "United States",
 "first_name": "Bob",
 "last_name": "Norman",
 "latitude": "45.41634",
 "longitude": "-75.6868",
 "phone": "555-625-1199",
 "province": "Kentucky",
 "zip": "40202",
 "name": "Bob Norman",
 "country_code": "US",
 "province_code": "KY"
 },
 "sms_marketing_phone": "+16135555555",
 "shipping_lines": {
 "code": "Free Shipping",
 "price": "0.00",
 "source": "shopify",
 "title": "Free Shipping"
 },
 "source_name": "web",
 "subtotal_price": "398.00",
 "tax_lines": {
 "price": "11.94",
 "rate": 0.06,
 "title": "State Tax",
 "channel_liable": true
 },
 "taxes_included": false,
 "token": "b1946ac92492d2347c6235b4d2611184",
 "total_discounts": "0.00",
 "total_duties": "105.31",
 "total_line_items_price": "398.00",
 "total_price": "409.94",
 "total_tax": "11.94",
 "total_weight": 400,
 "updated_at": "2012-08-24T14:02:15-04:00",
 "user_id": 1
 }
 */
