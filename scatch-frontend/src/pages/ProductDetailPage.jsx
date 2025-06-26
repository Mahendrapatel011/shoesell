import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance, AuthContext } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import { toast } from 'react-toastify';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NEW STATE FOR REVIEWS ---
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchProductAndReviews = async () => {
    try {
      setLoading(true);
      setReviewLoading(true);
      // Fetch product and reviews in parallel
      const [productRes, reviewsRes] = await Promise.all([
        axiosInstance.get(`/products/${id}`),
        axiosInstance.get(`/products/${id}/reviews`)
      ]);
      setProduct(productRes.data);
      setReviews(reviewsRes.data);
    } catch (err) {
      setError('Failed to fetch product details.');
      console.error(err);
    } finally {
      setLoading(false);
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndReviews();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product._id) return;
    try {
      const response = await axiosInstance.post(`/users/cart/add/${product._id}`);
      toast.success(response.data);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error(error.response?.data || "Failed to add product to cart.");
    }
  };
  
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (userRating === 0 || !userComment.trim()) {
        toast.error("Please provide a rating and a comment.");
        return;
    }
    setSubmitLoading(true);
    try {
        await axiosInstance.post(`/products/${id}/reviews`, {
            rating: userRating,
            comment: userComment,
        });
        toast.success("Review submitted successfully!");
        setUserRating(0);
        setUserComment('');
        fetchProductAndReviews(); // Refetch everything to show new review and updated rating
    } catch (err) {
        toast.error(err.response?.data || "Failed to submit review.");
    } finally {
        setSubmitLoading(false);
    }
  };


  if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
  if (!product) return <p style={{ textAlign: 'center' }}>Product not found.</p>;

  return (
    <>
      <div className="product-detail-container">
        <div className="product-detail-image-container">
          <img
            src={`http://localhost:3001/images/uploads/${product.image}`}
            alt={product.name}
            className="product-detail-image"
          />
        </div>
        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>
          <div className="product-detail-rating">
            <StarRating rating={product.rating} numReviews={product.numReviews} />
          </div>
          <p className="product-detail-price">₹{product.price}</p>
          <p className="product-detail-description">
            This is a sample description. More details about this fantastic shoe will be available soon. It features premium materials and is designed for both comfort and style.
          </p>
          {user && (
            <button onClick={handleAddToCart} className="add-to-cart-btn">
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* --- REVIEWS SECTION --- */}
      <div className="reviews-section-container">
        <h2>Customer Reviews</h2>
        
        {/* REVIEW SUBMISSION FORM */}
        {user && (
          <div className="review-form-container">
            <h3>Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label htmlFor="rating">Your Rating</label>
                <select id="rating" value={userRating} onChange={(e) => setUserRating(Number(e.target.value))} required>
                  <option value="0" disabled>Select...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="comment">Your Comment</label>
                <textarea id="comment" rows="4" value={userComment} onChange={(e) => setUserComment(e.target.value)} required></textarea>
              </div>
              <button type="submit" className="submit-review-btn" disabled={submitLoading}>
                {submitLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* REVIEWS LIST */}
        <div className="reviews-list">
          {reviewLoading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p>No reviews yet for this product. Be the first!</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="review-item">
                <strong>{review.user.fullname}</strong>
                <StarRating rating={review.rating} />
                <p className="review-comment">{review.comment}</p>
                <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;