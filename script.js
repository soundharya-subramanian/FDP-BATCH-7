// Modern Registration Form JavaScript

// Form validation patterns
const patterns = {
    fullname: /^[a-zA-Z\s]{3,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[0-9]{10}$/,
    password: /.{8,}/
};

// Get form elements
const form = document.getElementById('registrationForm');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const strengthMeter = document.getElementById('strengthMeter');
const strengthText = document.getElementById('strengthText');
const successMessage = document.getElementById('successMessage');

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Real-time validation
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', validateField);
    });

    // Password strength meter
    passwordInput.addEventListener('input', updatePasswordStrength);

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);

    // Form submission
    form.addEventListener('submit', handleFormSubmit);
});

// Validate individual field
function validateField(e) {
    const field = e.target;
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const errorElement = document.getElementById(`${fieldName}-error`);
    const formGroup = field.closest('.form-group');

    let isValid = true;
    let errorMessage = '';

    switch(fieldName) {
        case 'fullname':
            if (!fieldValue) {
                errorMessage = 'Full name is required';
                isValid = false;
            } else if (!patterns.fullname.test(fieldValue)) {
                errorMessage = 'Name should be at least 3 characters and contain only letters';
                isValid = false;
            }
            break;

        case 'email':
            if (!fieldValue) {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!patterns.email.test(fieldValue)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;

        case 'phone':
            if (!fieldValue) {
                errorMessage = 'Phone number is required';
                isValid = false;
            } else if (!patterns.phone.test(fieldValue)) {
                errorMessage = 'Phone number should be 10 digits';
                isValid = false;
            }
            break;

        case 'password':
            if (!fieldValue) {
                errorMessage = 'Password is required';
                isValid = false;
            } else if (!patterns.password.test(fieldValue)) {
                errorMessage = 'Password should be at least 8 characters';
                isValid = false;
            }
            // Check if confirmpassword is filled and validate match
            const confirmPassword = document.getElementById('confirmpassword');
            if (confirmPassword.value) {
                validateField({ target: confirmPassword });
            }
            break;

        case 'confirmpassword':
            if (!fieldValue) {
                errorMessage = 'Please confirm your password';
                isValid = false;
            } else if (fieldValue !== passwordInput.value) {
                errorMessage = 'Passwords do not match';
                isValid = false;
            }
            break;

        case 'terms':
            if (!field.checked) {
                errorMessage = 'You must agree to the terms and conditions';
                isValid = false;
            }
            break;
    }

    // Update UI
    if (isValid) {
        formGroup.classList.remove('error');
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }
    } else {
        formGroup.classList.add('error');
        if (errorElement) {
            errorElement.classList.add('show');
            errorElement.textContent = errorMessage;
        }
    }

    return isValid;
}

// Update password strength meter
function updatePasswordStrength() {
    const password = passwordInput.value;
    let strength = 0;
    let strengthLevel = '';

    // Check password length
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Check for uppercase
    if (/[A-Z]/.test(password)) strength++;

    // Check for lowercase
    if (/[a-z]/.test(password)) strength++;

    // Check for numbers
    if (/[0-9]/.test(password)) strength++;

    // Check for special characters
    if (/[!@#$%^&*()_+\-=\[\]{};:'",.<>?]/.test(password)) strength++;

    // Update strength meter
    strengthMeter.className = 'strength-meter';
    strengthText.className = 'strength-text';

    if (password.length === 0) {
        strengthText.textContent = 'Password strength';
        strengthMeter.style.width = '0%';
    } else if (strength <= 2) {
        strengthMeter.classList.add('weak');
        strengthText.classList.add('weak');
        strengthText.textContent = 'Weak password';
        strengthMeter.style.width = '33%';
    } else if (strength <= 4) {
        strengthMeter.classList.add('medium');
        strengthText.classList.add('medium');
        strengthText.textContent = 'Medium password';
        strengthMeter.style.width = '66%';
    } else {
        strengthMeter.classList.add('strong');
        strengthText.classList.add('strong');
        strengthText.textContent = 'Strong password';
        strengthMeter.style.width = '100%';
    }
}

// Toggle password visibility
function togglePasswordVisibility() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    // Validate all fields
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="password"]');
    let formIsValid = true;

    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            formIsValid = false;
        }
    });

    // Validate checkbox
    const termsCheckbox = document.getElementById('terms');
    const termsError = document.getElementById('terms-error');
    if (!termsCheckbox.checked) {
        document.getElementById('terms').closest('.form-group').classList.add('error');
        termsError.classList.add('show');
        termsError.textContent = 'You must agree to the terms and conditions';
        formIsValid = false;
    } else {
        document.getElementById('terms').closest('.form-group').classList.remove('error');
        termsError.classList.remove('show');
    }

    if (formIsValid) {
        // Show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';

        // Log form data (in real application, send to server)
        const formData = {
            fullname: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            password: document.getElementById('password').value
        };
        console.log('Form submitted with data:', formData);

        // Optional: Save to localStorage
        localStorage.setItem('userFormData', JSON.stringify(formData));
    }
}

// Reset form
function resetForm() {
    form.reset();
    form.style.display = 'flex';
    successMessage.style.display = 'none';
    strengthMeter.style.width = '0%';
    strengthText.textContent = 'Password strength';
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
    document.querySelectorAll('.form-group').forEach(el => {
        el.classList.remove('error');
    });
}

// Hook enter key for search box (optional)
document.addEventListener('DOMContentLoaded', function () {
    updateCartDisplay();

    const searchBox = document.querySelector('.fk-search-box input');
    const searchBtn = document.querySelector('.fk-search-btn');
    if (searchBox && searchBtn) {
        searchBox.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
        searchBtn.addEventListener('click', function () {
            // Simulate a search or filter feature
            let q = searchBox.value.trim().toLowerCase();
            let cards = document.querySelectorAll('.fk-product-card');
            cards.forEach(card => {
                let titleEl = card.querySelector('.fk-product-title');
                if (titleEl) {
                    let title = titleEl.textContent.trim().toLowerCase();
                    if (title.includes(q) || q === '') {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    }
});

