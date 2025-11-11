// Demo posts data for the Discussion Forum
// In a real app, this would come from the backend API

export const demoPosts = [
  // College Clubs Posts
  {
    id: '1',
    title: 'Tech Club Coding Competition - Register Now!',
    content: 'Hey everyone! The PES Tech Club is organizing a coding competition next month. We have exciting prizes and it\'s a great opportunity to showcase your skills. Registration closes on February 15th. All skill levels are welcome!',
    author: 'Rahul Sharma',
    authorId: 'user1',
    category: 'clubs',
    upvotes: 45,
    downvotes: 2,
    commentCount: 12,
    createdAt: '2024-01-28T10:00:00Z',
    tags: ['tech', 'competition', 'coding'],
    userVote: null, // 'upvote', 'downvote', or null
    comments: [
      {
        id: 'c1',
        author: 'Priya Patel',
        authorId: 'user2',
        content: 'This sounds amazing! Can beginners participate?',
        upvotes: 8,
        downvotes: 0,
        createdAt: '2024-01-28T11:00:00Z',
        userVote: null,
        replies: [
          {
            id: 'r1',
            author: 'Rahul Sharma',
            authorId: 'user1',
            content: 'Yes, absolutely! We have different difficulty levels.',
            upvotes: 5,
            downvotes: 0,
            createdAt: '2024-01-28T11:30:00Z',
            userVote: null
          }
        ]
      },
      {
        id: 'c2',
        author: 'Arjun Kumar',
        authorId: 'user3',
        content: 'What programming languages are allowed?',
        upvotes: 6,
        downvotes: 1,
        createdAt: '2024-01-28T12:00:00Z',
        userVote: null,
        replies: []
      }
    ]
  },
  {
    id: '2',
    title: 'Dance Club Auditions - Open to All!',
    content: 'The PES Dance Club is holding auditions for the annual cultural fest. We\'re looking for talented dancers for various dance styles - contemporary, hip-hop, classical, and more. Auditions will be held this Saturday at the Main Auditorium. Come show us your moves!',
    author: 'Sneha Reddy',
    authorId: 'user4',
    category: 'clubs',
    upvotes: 32,
    downvotes: 1,
    commentCount: 8,
    createdAt: '2024-01-27T14:30:00Z',
    tags: ['dance', 'auditions', 'cultural'],
    userVote: null,
    comments: [
      {
        id: 'c3',
        author: 'Meera Joshi',
        authorId: 'user5',
        content: 'Do we need to prepare a piece in advance?',
        upvotes: 4,
        downvotes: 0,
        createdAt: '2024-01-27T15:00:00Z',
        userVote: null,
        replies: []
      }
    ]
  },
  {
    id: '3',
    title: 'Photography Club - Weekly Photo Walk',
    content: 'Join us this Sunday for a photography walk around the campus. We\'ll be exploring different techniques and compositions. Bring your cameras (or phones)! All skill levels welcome. Meeting at 6 AM near the main gate.',
    author: 'Vikram Singh',
    authorId: 'user6',
    category: 'clubs',
    upvotes: 28,
    downvotes: 0,
    commentCount: 5,
    createdAt: '2024-01-26T09:00:00Z',
    tags: ['photography', 'event', 'campus'],
    userVote: null,
    comments: []
  },
  
  // Canteen Food Posts
  {
    id: '4',
    title: 'Best Breakfast Options in Canteen?',
    content: 'What are your favorite breakfast items in the canteen? I\'ve been trying different things but want to know what everyone recommends. The dosa is pretty good, but looking for more options!',
    author: 'Ananya Iyer',
    authorId: 'user7',
    category: 'canteen',
    upvotes: 67,
    downvotes: 3,
    commentCount: 24,
    createdAt: '2024-01-29T08:00:00Z',
    tags: ['food', 'breakfast', 'recommendations'],
    userVote: null,
    comments: [
      {
        id: 'c4',
        author: 'Karan Malhotra',
        authorId: 'user8',
        content: 'The idli-vada combo is amazing! Also try the upma, it\'s surprisingly good.',
        upvotes: 12,
        downvotes: 1,
        createdAt: '2024-01-29T08:30:00Z',
        userVote: null,
        replies: []
      },
      {
        id: 'c5',
        author: 'Divya Nair',
        authorId: 'user9',
        content: 'Poha is my go-to! Quick, filling, and delicious.',
        upvotes: 9,
        downvotes: 0,
        createdAt: '2024-01-29T09:00:00Z',
        userVote: null,
        replies: []
      },
      {
        id: 'c6',
        author: 'Rohan Desai',
        authorId: 'user10',
        content: 'The paratha with curd is underrated. Try it if you haven\'t!',
        upvotes: 7,
        downvotes: 0,
        createdAt: '2024-01-29T09:15:00Z',
        userVote: null,
        replies: []
      }
    ]
  },
  {
    id: '5',
    title: 'Canteen Lunch Menu - What\'s Good Today?',
    content: 'Looking for lunch suggestions. What\'s the best item on today\'s menu? Heard they have biryani on Wednesdays - is it worth it?',
    author: 'Amit Verma',
    authorId: 'user11',
    category: 'canteen',
    upvotes: 41,
    downvotes: 2,
    commentCount: 15,
    createdAt: '2024-01-29T12:00:00Z',
    tags: ['food', 'lunch', 'menu'],
    userVote: null,
    comments: [
      {
        id: 'c7',
        author: 'Ravi Shetty',
        authorId: 'user12',
        content: 'The biryani is definitely worth it! Get there early though, it runs out fast.',
        upvotes: 15,
        downvotes: 0,
        createdAt: '2024-01-29T12:15:00Z',
        userVote: null,
        replies: []
      },
      {
        id: 'c8',
        author: 'Pooja Agarwal',
        authorId: 'user13',
        content: 'The thali is always a safe bet. Good variety and filling.',
        upvotes: 8,
        downvotes: 0,
        createdAt: '2024-01-29T12:30:00Z',
        userVote: null,
        replies: []
      }
    ]
  },
  {
    id: '6',
    title: 'Canteen Prices - Are They Fair?',
    content: 'I feel like the canteen prices have increased quite a bit this semester. A simple vada pav that used to cost ₹15 is now ₹25. What do you all think? Is it still reasonable compared to outside?',
    author: 'Nikhil Rao',
    authorId: 'user14',
    category: 'canteen',
    upvotes: 52,
    downvotes: 8,
    commentCount: 18,
    createdAt: '2024-01-28T16:00:00Z',
    tags: ['food', 'prices', 'discussion'],
    userVote: null,
    comments: [
      {
        id: 'c9',
        author: 'Shreya Menon',
        authorId: 'user15',
        content: 'I agree, prices have gone up. But still cheaper than nearby restaurants.',
        upvotes: 10,
        downvotes: 2,
        createdAt: '2024-01-28T16:30:00Z',
        userVote: null,
        replies: []
      },
      {
        id: 'c10',
        author: 'Aditya Nair',
        authorId: 'user16',
        content: 'The quality has improved too, so I think it\'s justified.',
        upvotes: 6,
        downvotes: 5,
        createdAt: '2024-01-28T17:00:00Z',
        userVote: null,
        replies: []
      }
    ]
  },
  {
    id: '7',
    title: 'Best Snacks for Evening Break?',
    content: 'What are your favorite evening snacks from the canteen? Looking for something light but satisfying between classes.',
    author: 'Isha Gupta',
    authorId: 'user17',
    category: 'canteen',
    upvotes: 38,
    downvotes: 1,
    commentCount: 11,
    createdAt: '2024-01-27T17:00:00Z',
    tags: ['food', 'snacks', 'evening'],
    userVote: null,
    comments: [
      {
        id: 'c11',
        author: 'Varun Reddy',
        authorId: 'user18',
        content: 'Samosa with chutney is my favorite! Also try the bread pakora.',
        upvotes: 9,
        downvotes: 0,
        createdAt: '2024-01-27T17:30:00Z',
        userVote: null,
        replies: []
      }
    ]
  },
  
  // Upcoming Events Posts
  {
    id: '8',
    title: 'Annual Tech Fest - PESTECH 2024',
    content: 'PESTECH 2024 is happening next month! This year we have workshops on AI/ML, web development, cybersecurity, and more. Plus, we have exciting guest speakers from top tech companies. Registration is open now. Don\'t miss out!',
    author: 'Tech Fest Committee',
    authorId: 'user19',
    category: 'events',
    upvotes: 89,
    downvotes: 1,
    commentCount: 32,
    createdAt: '2024-01-25T10:00:00Z',
    tags: ['techfest', 'workshop', 'event'],
    userVote: null,
    comments: [
      {
        id: 'c12',
        author: 'Rahul Sharma',
        authorId: 'user1',
        content: 'Are there any prerequisites for the AI/ML workshop?',
        upvotes: 5,
        downvotes: 0,
        createdAt: '2024-01-25T11:00:00Z',
        userVote: null,
        replies: [
          {
            id: 'r2',
            author: 'Tech Fest Committee',
            authorId: 'user19',
            content: 'Basic Python knowledge is recommended, but not mandatory. We\'ll cover the basics.',
            upvotes: 8,
            downvotes: 0,
            createdAt: '2024-01-25T11:30:00Z',
            userVote: null
          }
        ]
      },
      {
        id: 'c13',
        author: 'Priya Patel',
        authorId: 'user2',
        content: 'Will certificates be provided?',
        upvotes: 12,
        downvotes: 0,
        createdAt: '2024-01-25T12:00:00Z',
        userVote: null,
        replies: []
      }
    ]
  },
  {
    id: '9',
    title: 'Cultural Fest - PESCULT 2024 Auditions',
    content: 'PESCULT 2024 is coming! Auditions for various performances are starting next week. We\'re looking for singers, dancers, musicians, and performers of all kinds. Sign up at the student activities office or register online.',
    author: 'Cultural Committee',
    authorId: 'user20',
    category: 'events',
    upvotes: 56,
    downvotes: 2,
    commentCount: 19,
    createdAt: '2024-01-24T14:00:00Z',
    tags: ['cultural', 'auditions', 'fest'],
    userVote: null,
    comments: [
      {
        id: 'c14',
        author: 'Sneha Reddy',
        authorId: 'user4',
        content: 'What dates are the auditions?',
        upvotes: 4,
        downvotes: 0,
        createdAt: '2024-01-24T15:00:00Z',
        userVote: null,
        replies: []
      }
    ]
  },
  {
    id: '10',
    title: 'Sports Day 2024 - Register Your Team!',
    content: 'Annual Sports Day is scheduled for next month. We have competitions in cricket, football, basketball, badminton, and more. Register your teams by February 10th. Let\'s make this the best sports day yet!',
    author: 'Sports Committee',
    authorId: 'user21',
    category: 'events',
    upvotes: 73,
    downvotes: 1,
    commentCount: 25,
    createdAt: '2024-01-23T09:00:00Z',
    tags: ['sports', 'competition', 'teams'],
    userVote: null,
    comments: [
      {
        id: 'c15',
        author: 'Amit Verma',
        authorId: 'user11',
        content: 'How many players per team for cricket?',
        upvotes: 6,
        downvotes: 0,
        createdAt: '2024-01-23T10:00:00Z',
        userVote: null,
        replies: []
      },
      {
        id: 'c16',
        author: 'Ravi Shetty',
        authorId: 'user12',
        content: '11 players per team. We can help form teams if needed!',
        upvotes: 3,
        downvotes: 0,
        createdAt: '2024-01-23T10:30:00Z',
        userVote: null,
        replies: []
      }
    ]
  },
  {
    id: '11',
    title: 'Guest Lecture: Career in Tech Industry',
    content: 'We\'re hosting a guest lecture by industry experts from Google, Microsoft, and Amazon next week. Topics include career paths, interview preparation, and industry insights. Limited seats available. Register now!',
    author: 'Placement Cell',
    authorId: 'user22',
    category: 'events',
    upvotes: 94,
    downvotes: 0,
    commentCount: 28,
    createdAt: '2024-01-22T11:00:00Z',
    tags: ['career', 'lecture', 'placement'],
    userVote: null,
    comments: [
      {
        id: 'c17',
        author: 'Arjun Kumar',
        authorId: 'user3',
        content: 'Will this be recorded for those who can\'t attend?',
        upvotes: 15,
        downvotes: 0,
        createdAt: '2024-01-22T12:00:00Z',
        userVote: null,
        replies: []
      }
    ]
  },
  {
    id: '12',
    title: 'Hackathon - Code for Good',
    content: 'Join us for a 24-hour hackathon focused on building solutions for social problems. Prizes worth ₹50,000! Food and beverages will be provided. Teams of 2-4 members. Register by February 5th.',
    author: 'Tech Club',
    authorId: 'user1',
    category: 'events',
    upvotes: 61,
    downvotes: 1,
    commentCount: 16,
    createdAt: '2024-01-21T13:00:00Z',
    tags: ['hackathon', 'coding', 'competition'],
    userVote: null,
    comments: []
  },
  
  // General Discussion Posts
  {
    id: '13',
    title: 'Study Groups for DSA Course',
    content: 'Looking to form a study group for Data Structures and Algorithms. We can meet weekly, solve problems together, and prepare for exams. Anyone interested?',
    author: 'Karan Malhotra',
    authorId: 'user8',
    category: 'general',
    upvotes: 34,
    downvotes: 0,
    commentCount: 9,
    createdAt: '2024-01-29T15:00:00Z',
    tags: ['study', 'dsa', 'group'],
    userVote: null,
    comments: []
  },
  {
    id: '14',
    title: 'Library Study Hours - Best Times?',
    content: 'When is the library least crowded? I\'m looking for quiet study time but it seems packed all the time. Any suggestions?',
    author: 'Meera Joshi',
    authorId: 'user5',
    category: 'general',
    upvotes: 27,
    downvotes: 1,
    commentCount: 7,
    createdAt: '2024-01-28T18:00:00Z',
    tags: ['library', 'study', 'campus'],
    userVote: null,
    comments: []
  },
  {
    id: '15',
    title: 'Parking Issues on Campus',
    content: 'The parking situation is getting worse. Hard to find a spot, especially during peak hours. Anyone else facing this issue? Maybe we should suggest more parking spaces to the admin.',
    author: 'Vikram Singh',
    authorId: 'user6',
    category: 'general',
    upvotes: 48,
    downvotes: 5,
    commentCount: 14,
    createdAt: '2024-01-27T19:00:00Z',
    tags: ['parking', 'campus', 'issue'],
    userVote: null,
    comments: []
  }
];

export const categories = [
  { id: 'all', name: 'All Posts', icon: '📋' },
  { id: 'clubs', name: 'Clubs', icon: '🎭' },
  { id: 'canteen', name: 'Canteen', icon: '🍽️' },
  { id: 'events', name: 'Events', icon: '📅' },
  { id: 'general', name: 'General', icon: '💬' }
];

export const sortOptions = [
  { id: 'newest', name: 'Newest First' },
  { id: 'oldest', name: 'Oldest First' },
  { id: 'popular', name: 'Most Popular' },
  { id: 'comments', name: 'Most Comments' }
];

