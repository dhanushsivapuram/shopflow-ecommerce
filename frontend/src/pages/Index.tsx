import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { Search } from 'lucide-react';
import API from '@/config/api';


/* ✅ Product type matching backend (MongoDB) */
interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  /* ✅ Fetch products from backend */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ✅ Search filter */
 const filteredProducts = products.filter(product =>
  product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  (product.category &&
    product.category.toLowerCase().includes(searchQuery.toLowerCase()))
);


  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-surface py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Discover Premium
              <span className="text-primary"> Products</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Curated collection of high-quality items designed for modern living.
              Simple, beautiful, and built to last.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-foreground">
              {searchQuery ? 'Search Results' : 'All Products'}
            </h2>
            <span className="text-muted-foreground">
              {filteredProducts.length} products
            </span>
          </div>

          {/* ✅ Loading state */}
          {loading ? (
            <p className="text-center text-muted-foreground">Loading products...</p>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No products found for "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
