const validateName = (name) => {
    if (!name || typeof name !== 'string') return 'Name is required';
    const trimmed = name.trim();
    if (trimmed.length < 20 || trimmed.length > 60) {
        return 'Name must be between 20 and 60 characters';
    }
    return null;
};

const validateAddress = (address) => {
    if (!address || typeof address !== 'string') return 'Address is required';
    const trimmed = address.trim();
    if (trimmed.length > 400) {
        return 'Address must not exceed 400 characters';
    }
    return null;
};

const validatePassword = (password) => {
    if (!password || typeof password !== 'string') return 'Password is required';
    if (password.length < 8 || password.length > 16) {
        return 'Password must be between 8 and 16 characters';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
        return 'Password must contain at least one special character';
    }
    return null;
};

const validateEmail = (email) => {
    if (!email || typeof email !== 'string') return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return 'Invalid email format';
    }
    return null;
};

const validateRatingValue = (rating) => {
    const num = Number(rating);
    if (!Number.isInteger(num) || num < 1 || num > 5) {
        return 'Rating must be an integer between 1 and 5';
    }
    return null;
};

// Express middleware wrappers
const validateSignup = (req, res, next) => {
    const { name, email, password, address } = req.body;
    
    const nameErr = validateName(name);
    if (nameErr) return res.status(400).json({ message: nameErr });

    const emailErr = validateEmail(email);
    if (emailErr) return res.status(400).json({ message: emailErr });

    const passErr = validatePassword(password);
    if (passErr) return res.status(400).json({ message: passErr });

    const addrErr = validateAddress(address);
    if (addrErr) return res.status(400).json({ message: addrErr });

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    const emailErr = validateEmail(email);
    if (emailErr) return res.status(400).json({ message: emailErr });

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    next();
};

const validateUpdatePassword = (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required' });
    }

    const passErr = validatePassword(newPassword);
    if (passErr) return res.status(400).json({ message: passErr });

    next();
};

const validateUserCreate = (req, res, next) => {
    const { name, email, password, address, role } = req.body;

    const nameErr = validateName(name);
    if (nameErr) return res.status(400).json({ message: nameErr });

    const emailErr = validateEmail(email);
    if (emailErr) return res.status(400).json({ message: emailErr });

    const passErr = validatePassword(password);
    if (passErr) return res.status(400).json({ message: passErr });

    const addrErr = validateAddress(address);
    if (addrErr) return res.status(400).json({ message: addrErr });

    const validRoles = ['ADMIN', 'USER', 'STORE_OWNER'];
    if (!role || !validRoles.includes(role)) {
        return res.status(400).json({ message: 'Role must be ADMIN, USER, or STORE_OWNER' });
    }

    next();
};

const validateStoreCreate = (req, res, next) => {
    const { name, email, address } = req.body;

    const nameErr = validateName(name);
    if (nameErr) return res.status(400).json({ message: nameErr });

    const emailErr = validateEmail(email);
    if (emailErr) return res.status(400).json({ message: emailErr });

    const addrErr = validateAddress(address);
    if (addrErr) return res.status(400).json({ message: addrErr });

    next();
};

const validateRatingSubmit = (req, res, next) => {
    const { rating } = req.body;
    const ratingErr = validateRatingValue(rating);
    if (ratingErr) return res.status(400).json({ message: ratingErr });
    next();
};

module.exports = {
    validateName,
    validateAddress,
    validatePassword,
    validateEmail,
    validateRatingValue,
    validateSignup,
    validateLogin,
    validateUpdatePassword,
    validateUserCreate,
    validateStoreCreate,
    validateRatingSubmit
};
