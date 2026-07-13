"""
Sample client for the Neighbourhood Library Service API.

Demonstrates the core flow: create a book, create a member, borrow the book,
attempt to borrow it again (should fail), and return it.

Usage:
    python sample_client.py
    (requires the backend running at http://localhost:8000, see README.md)
"""

import sys

import requests

BASE_URL = 'http://localhost:8000/api'


def show(label, response):
    print(f'\n{label} -> {response.status_code}')
    print(response.json())
    return response


def main():
    book = show('Create book', requests.post(f'{BASE_URL}/books/', json={
        'isbn': '978-0451524935',
        'title': 'Nineteen Eighty-Four',
        'author': 'George Orwell',
        'genre': 'Dystopian',
        'total_copies': 1,
    })).json()

    member = show('Create member', requests.post(f'{BASE_URL}/members/', json={
        'first_name': 'Sam',
        'last_name': 'Rivera',
        'email': 'sam.rivera@example.com',
    })).json()

    loan = show('Borrow book', requests.post(f'{BASE_URL}/loans/', json={
        'book': book['id'],
        'member': member['id'],
    })).json()

    show(
        'Borrow same book again (expected 400, no copies left)',
        requests.post(f'{BASE_URL}/loans/', json={
            'book': book['id'],
            'member': member['id'],
        }),
    )

    show(
        "List this member's loans",
        requests.get(f'{BASE_URL}/loans/', params={'member': member['id']}),
    )

    show(
        'Return book',
        requests.post(f'{BASE_URL}/loans/{loan["id"]}/return_book/'),
    )

    show(
        'Return same loan again (expected 400)',
        requests.post(f'{BASE_URL}/loans/{loan["id"]}/return_book/'),
    )


if __name__ == '__main__':
    try:
        main()
    except requests.exceptions.ConnectionError:
        print('Could not reach the API. Is the backend running at ' + BASE_URL + '?')
        sys.exit(1)
