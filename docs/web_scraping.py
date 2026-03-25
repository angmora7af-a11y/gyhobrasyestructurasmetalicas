import requests
from bs4 import BeautifulSoup
import pandas as pd

def scrape_gyh_bogota(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Error al acceder a la página: {response.status_code}")
        return
    
    soup = BeautifulSoup(response.text, 'html.parser')
    products_data = []

    # Localizador genérico de productos basado en la estructura de WooCommerce
    products = soup.find_all('li', class_='product')

    for product in products:
        item = {
            'nombre': product.find('h2', class_='woocommerce-loop-product__title').text.strip() if product.find('h2') else "N/A",
            'precio': product.find('span', class_='woocommerce-Price-amount').text.strip() if product.find('span', class_='woocommerce-Price-amount') else "Consultar",
            'link': product.find('a')['href'] if product.find('a') else "N/A",
            'imagen': product.find('img')['src'] if product.find('img') else "N/A"
        }
        products_data.append(item)

    return pd.DataFrame(products_data)

# Ejecución
# url_target = "https://gyhbogota.com/categoria-producto/tecnologia/"
# df = scrape_gyh_bogota(url_target)
# df.to_csv('productos_gyh.csv', index=False)