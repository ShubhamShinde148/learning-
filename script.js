document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggleBtn = document.getElementById('password-toggle');
    const eyeOpenIcon = passwordToggleBtn.querySelector('.eye-open-icon');
    const eyeClosedIcon = passwordToggleBtn.querySelector('.eye-closed-icon');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');

    // Email Regex Pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Toggle Password Visibility
    passwordToggleBtn.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

        if (isPassword) {
            eyeOpenIcon.classList.add('hidden');
            eyeClosedIcon.classList.remove('hidden');
            passwordToggleBtn.setAttribute('aria-label', 'Hide password');
        } else {
            eyeOpenIcon.classList.remove('hidden');
            eyeClosedIcon.classList.add('hidden');
            passwordToggleBtn.setAttribute('aria-label', 'Show password');
        }
    });

    // Form Field Real-time Validation
    const validateField = (input, group, validationFn, forceShowError = false) => {
        const isValid = validationFn(input.value);
        if (isValid || (input.value === '' && !forceShowError)) {
            group.classList.remove('invalid');
        } else {
            group.classList.add('invalid');
        }
        return isValid;
    };

    // Validation Functions
    const validateEmail = (value) => emailPattern.test(value.trim());
    const validatePassword = (value) => value.length >= 8;

    // Attach Validation Listeners
    emailInput.addEventListener('input', () => {
        const group = document.getElementById('email-group');
        validateField(emailInput, group, validateEmail);
    });

    emailInput.addEventListener('blur', () => {
        const group = document.getElementById('email-group');
        validateField(emailInput, group, validateEmail, true);
    });

    passwordInput.addEventListener('input', () => {
        const group = document.getElementById('password-group');
        validateField(passwordInput, group, validatePassword);
    });

    passwordInput.addEventListener('blur', () => {
        const group = document.getElementById('password-group');
        validateField(passwordInput, group, validatePassword, true);
    });

    // Handle Form Submit
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailGroup = document.getElementById('email-group');
        const passwordGroup = document.getElementById('password-group');

        // Validate both fields and force errors to show
        const isEmailValid = validateField(emailInput, emailGroup, validateEmail, true);
        const isPasswordValid = validateField(passwordInput, passwordGroup, validatePassword, true);

        // If either is invalid, refocus and display error states
        if (!isEmailValid || !isPasswordValid) {
            if (!isEmailValid) {
                emailInput.focus();
            } else if (!isPasswordValid) {
                passwordInput.focus();
            }
            showToast('Please correct the validation errors before signing in.', 'error');
            return;
        }

        // Trigger Loading State
        submitBtn.disabled = true;
        btnText.textContent = 'Verifying...';
        btnLoader.classList.remove('hidden');

        // Simulate API Authentication Request
        setTimeout(() => {
            // Mock dynamic credentials check
            if (emailInput.value.trim() === 'demo@example.com' && passwordInput.value === 'password123') {
                showToast('Successfully signed in! Redirecting...', 'success');
                setTimeout(() => {
                    resetForm();
                }, 1500);
            } else {
                showToast('Incorrect email or password. Hint: demo@example.com & password123', 'error');
                submitBtn.disabled = false;
                btnText.textContent = 'Sign In';
                btnLoader.classList.add('hidden');
                passwordGroup.classList.add('invalid');
                passwordInput.focus();
            }
        }, 1800);
    });

    // Reset Form Utility
    const resetForm = () => {
        loginForm.reset();
        submitBtn.disabled = false;
        btnText.textContent = 'Sign In';
        btnLoader.classList.add('hidden');
        document.getElementById('email-group').classList.remove('invalid');
        document.getElementById('password-group').classList.remove('invalid');
        // Reset Password Input visibility
        passwordInput.setAttribute('type', 'password');
        eyeOpenIcon.classList.remove('hidden');
        eyeClosedIcon.classList.add('hidden');
    };

    // Show Notification Toast
    let toastTimeout;
    const showToast = (message, type) => {
        clearTimeout(toastTimeout);

        toast.className = 'toast'; // Reset classes
        toast.classList.add(type);
        toastMessage.textContent = message;

        // Force Reflow
        toast.offsetHeight;

        toast.classList.add('show');
        toast.classList.remove('hidden');

        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 400); // Wait for transition out
        }, 4000);
    };
});
