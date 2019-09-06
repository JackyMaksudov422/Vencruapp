export const PAGE_DIALOG = {
    EMAIL_VERIFICATION: 0,
    BUSINESS_SETUP_REQUEST: 1,
    BUSINESS_SETUP_SUCCESS: 2,
};

export const CURRENCIES = {
    'ngn': '₦ - Nigerian Naira',
    'usd': '$ - US Dollar',
    'kes': 'KSh - Kenyan Shilling',
    'ghs': 'GH₵ - Ghanaian Cedi',
    'zar': 'R - South African Rand',
    'cad': '$ - Canadian Dollar',
    'gbp': '£ - UK Pound Sterling',
};

export const CURRENCIES_SIGNS = {
    'ngn': '₦',
    'usd': '$',
    'kes': 'KSh',
    'ghs': 'GH₵',
    'zar': 'R',
    'cad': '$',
    'gbp': '£',
    '₦' : '₦',
    '$' : '$',
    '£' : '£',
    'KSh': 'KSh',
    'GHC': 'GHC'
};

export const ACCOUNT_TYPES = {
    'savings': 'Savings',
    'current': 'Current',
};

export const ROLE_DESCRIPTIONS = {
    'admin': 'Administrator',
    'accountant': 'Account Sales Rep',
    'contractor': 'Contractor',
};

export const PRIVILEGES = {
    'create-send-invoice': {
        label: 'Create & Send Invoices',
        roles: ['admin', 'accountant']
    },
    'upload-expenses': {
        label: 'Upload Expenses',
        roles: ['accountant', 'admin']
    },
    'add-clients': {
        label: 'Add Clients',
        roles: ['account', 'admin'],
    },
    'create-and-send-campaigns': {
        label: 'Create & Send Campaigns',
        roles: ['admin', 'contractor'],
    },
};

export const ROLE_TYPES = {
    'admin': 'Administrator',
    'staff': 'Staff',
    'constractor': 'Contractor',
};

export const EXPENSE_CATEGORIES = [
    'Transportation',
    'Advertising/Marketing',
    'Meals and Entertainment',
    'Rent',
    'Office Expenses',
    'Salaries',
    'Utilities', 
    'Phone Credit',
    'Other'
];

export const EXPENSE_CATEGORIES_ICONS = {
    'Transportation': 'car',
    'Advertising/Marketing': 'megaphone',
    'Meals and Entertainment': 'pizza',
    'Rent': 'home',
    'Office Expenses': 'paper',
    'Salaries': 'card',
    'Utilities': 'water',
    'Phone Credit': 'call',
    'Other': 'card'
};

export const EXPENSE_CATEGORIES_COLORS = {
    'Transportation': 'green',
    'Advertising/Marketing': 'blue',
    'Meals and Entertainment': 'orange',
    'Rent': 'purple',
    'Office Expenses': 'black',
    'Salaries': 'black',
    'Utilities': 'black',
    'Phone Credit': 'black',
    'Other': 'black',
}

export const PAYMENT_OPTIONS = [
    'Cash', 
    'Online Payment',
    'POS',
    'Bank Transfer'
];

export const INDUSTRIES = [
    {
        icon: require('../assets/planning.png'),
        name: 'Event Planning',
        services: [
            'Other'
        ]
    },
    {
        icon: require('../assets/trade.png'),
        name: 'Trades and Services',
        services: [
            'Other'
        ]
    },
    {
        icon: require('../assets/fashion.png'),
        name: 'Fashion/Accessories',
        services: [
            'Other'
        ]
    },
    {
        icon: require('../assets/IT.png'),
        name: 'Development and IT',
        services: [
            'Web App Development',
            'Other'
        ]
    },
    {
        name: 'Photography',
        services: [
            'Other'
        ]
    },
    {
        name: 'Bakery/Desert',
        services: [
            'Other'
        ]
    },
    {
        name: 'Graphic Design',
        services: [
            'Other'
        ]
    },
    {
        name: 'Business Consulting',
        services: [
            'Other'
        ]
    },
    {
        name: 'Planning',
        services: [
            'Other'
        ]
    },
    {
        name: 'Videography',
        services: [
            'Other'
        ]
    },
    {
        name: 'Marketing/PR',
        services: [
            'Other'
        ]
    },
    {
        name: 'Venue',
        services: [
            'Other'
        ]
    },
    {
        name: 'Rentals/Photo Booths',
        services: [
            'Other'
        ]
    },
    {
        name: 'Hair/Makeup',
        services: [
            'Other'
        ]
    },
    {
        name: 'Catering',
        services: [
            'Other'
        ]
    },
    {
        name: 'Interior Design',
        services: [
            'Other'
        ]
    },
];

export const COUNTRIES_LIST = [
    "Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas"
    ,"Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands"
    ,"Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica"
    ,"Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea"
    ,"Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana"
    ,"Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India"
    ,"Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia"
    ,"Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania"
    ,"Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia"
    ,"New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal"
    ,"Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles"
    ,"Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","St. Lucia","Sudan"
    ,"Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia"
    ,"Turkey","Turkmenistan","Turks & Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay"
    ,"Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"
];