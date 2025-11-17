// --- Data Storage (In-Session) [cite: 38, 39] ---
const commentsData = {
    article1: [],
    article2: []
};

// --- Utility Functions ---

/**
 * Calculates and updates the total comment count and average rating.
 * @param {string} articleId - 'article1' or 'article2'
 */
function updateStatistics(articleId) {
    const comments = commentsData[articleId];
    const totalComments = comments.length;
    
    // Filter for valid ratings (1-5)
    const validRatings = comments
        .map(c => c.rating)
        .filter(r => r !== null && r >= 1 && r <= 5);

    const totalRatingSum = validRatings.reduce((sum, rating) => sum + rating, 0);
    
    let averageRating = 'N/A';
    if (validRatings.length > 0) {
        averageRating = (totalRatingSum / validRatings.length).toFixed(1);
    }

    // Update the DOM elements [cite: 36, 37]
    document.getElementById(`total-comments-${articleId}`).textContent = totalComments;
    document.getElementById(`average-rating-${articleId}`).textContent = averageRating;
}

/**
 * Renders the list of submitted comments dynamically.
 * @param {string} articleId - 'article1' or 'article2'
 */
function renderComments(articleId) {
    const commentsList = document.getElementById(`comments-list-${articleId}`);
    commentsList.innerHTML = ''; // Clear existing list
    
    const comments = commentsData[articleId];

    if (comments.length === 0) {
        commentsList.innerHTML = '<p>No comments yet. Be the first to engage!</p>';
        return;
    }

    comments.forEach(comment => {
        // Create star display (e.g., '⭐⭐⭐⭐' or 'N/A')
        const ratingStars = comment.rating 
            ? `<span class="comment-rating">${'★'.repeat(comment.rating)}${'☆'.repeat(5 - comment.rating)}</span>`
            : 'N/A';

        const commentHtml = `
            <div class="comment-entry">
                <strong>${comment.name}</strong>
                <p>${comment.text}</p>
                <p>Rating: ${ratingStars}</p>
            </div>
        `;
        commentsList.innerHTML += commentHtml;
    });
}

/**
 * Performs client-side validation for all form fields.
 * @param {string} articleId - 'article1' or 'article2'
 * @returns {boolean} - true if validation passes, false otherwise
 */
function validateForm(articleId) {
    let isValid = true;
    
    // Get form elements
    const nameInput = document.getElementById(`name-${articleId}`);
    const emailInput = document.getElementById(`email-${articleId}`);
    const commentTextInput = document.getElementById(`comment-text-${articleId}`);
    
    // Get error containers
    const errorName = document.getElementById(`error-name-${articleId}`);
    const errorEmail = document.getElementById(`error-email-${articleId}`);
    const errorCommentText = document.getElementById(`error-comment-text-${articleId}`);

    // Clear previous errors
    errorName.textContent = '';
    errorEmail.textContent = '';
    errorCommentText.textContent = '';

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const commentText = commentTextInput.value.trim();

    // 1. Name Validation (Required, Min 2, Max 50) [cite: 16, 17, 18, 19, 20]
    if (name.length < 2 || name.length > 50) {
        errorName.textContent = "Name should be between 2 and 50 characters";
        isValid = false;
    }

    // 2. Email Validation (Optional but validated if provided, must contain @) [cite: 21, 22, 25]
    if (email.length > 0 && !email.includes('@')) {
        errorEmail.textContent = "Please enter a valid email address";
        isValid = false;
    }

    // 3. Comment Text Validation (Required, Min 10, Max 500) [cite: 26, 27, 28, 29, 30]
    if (commentText.length < 10 || commentText.length > 500) {
        errorCommentText.textContent = "Comment should between 10 and 500 characters";
        isValid = false;
    }

    return isValid;
}

/**
 * Handles the form submission event.
 * @param {Event} event - The form submission event
 * @param {string} articleId - 'article1' or 'article2'
 */
function handleSubmit(event, articleId) {
    event.preventDefault(); // Stop default form submission/page reload

    if (!validateForm(articleId)) {
        return; // Stop if validation fails
    }

    const form = document.getElementById(`comment-form-${articleId}`);
    const formData = new FormData(form);

    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const commentText = formData.get('commentText').trim();
    
    // Rating is optional. If not selected, it's null.
    const ratingValue = formData.get('rating');
    const rating = ratingValue ? parseInt(ratingValue) : null; 

    // Create the new comment object
    const newComment = {
        name: name,
        email: email,
        text: commentText,
        rating: rating
    };

    // Add the new comment to the data array [cite: 38, 39]
    commentsData[articleId].push(newComment);

    // Update all dynamic displays 
    renderComments(articleId);
    updateStatistics(articleId);
    
    // Reset the form
    form.reset();
    document.getElementById(`selected-rating-${articleId}`).textContent = 'Selected Rating: N/A';
}

/**
 * Initializes the page by setting up event listeners.
 */
function initialize() {
    // Initial rendering of empty states/stats
    updateStatistics('article1');
    renderComments('article1');
    updateStatistics('article2');
    renderComments('article2');

    // Event listener for the star rating system to display selected rating [cite: 33]
    document.querySelectorAll('.star-rating input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const articleId = e.target.closest('.star-rating').getAttribute('data-article-id');
            const selectedRatingDisplay = document.getElementById(`selected-rating-${articleId}`);
            const rating = e.target.value;
            selectedRatingDisplay.textContent = `Selected Rating: ${rating} Star${rating > 1 ? 's' : ''}`;
        });
    });

    // Handle case where user clears the selection (optional but good practice)
    document.querySelectorAll('.star-rating').forEach(ratingDiv => {
        ratingDiv.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const articleId = e.target.closest('.star-rating').getAttribute('data-article-id');
            const selectedRadio = ratingDiv.querySelector('input[type="radio"]:checked');
            if (selectedRadio) {
                selectedRadio.checked = false;
                document.getElementById(`selected-rating-${articleId}`).textContent = 'Selected Rating: N/A';
            }
        });
    });
}

// Run the initialization function when the script loads
initialize();