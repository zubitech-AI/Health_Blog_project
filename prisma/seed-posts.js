const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const generateSlug = (text) => text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').trim();

const dummyPosts = [
    {
        title: "10 Effective Ways to Lose Belly Fat",
        categorySlug: "diet-nutrition",
        subcategorySlug: "weight-loss",
        excerpt: "Losing belly fat can be challenging, but with the right diet and exercise strategies, you can achieve your goals. Here are 10 effective methods based on science.",
        content: "<h2>Understanding Belly Fat</h2><p>Belly fat, or visceral fat, is linked to numerous health issues. To reduce it, you need a combination of cardiovascular exercise, strength training, and a proper diet.</p><h3>1. Eat Plenty of Soluble Fiber</h3><p>Soluble fiber absorbs water and forms a gel that helps slow down food as it passes through your digestive system, helping you feel full.</p><h3>2. Avoid Foods That Contain Trans Fats</h3><p>Trans fats are linked to inflammation and abdominal fat gain. Read labels carefully.</p><h3>3. Don't Drink Too Much Alcohol</h3><p>High alcohol intake is associated with an increased risk of excess belly fat.</p><img src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' alt='Healthy Food' />",
        featuredImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metaKeywords: "belly fat, weight loss, diet, fitness",
    },
    {
        title: "The Ultimate Guide to a Healthy Morning Routine",
        categorySlug: "health",
        subcategorySlug: "general-health-tips",
        excerpt: "Start your day right! A structured morning routine can boost your productivity, enhance your mood, and set a positive tone for the entire day.",
        content: "<h2>Why Morning Routines Matter</h2><p>How you begin your morning often dictates how the rest of your day goes. Successful people swear by their morning rules.</p><h3>1. Wake Up Early</h3><p>Giving yourself extra time in the morning prevents the stressful rush.</p><h3>2. Drink Water Immediately</h3><p>Hydrate your body after 7-8 hours of sleep. A glass of lemon water is excellent.</p><h3>3. Move Your Body</h3><p>Even a 10-minute stretch or walk gets the blood flowing.</p><img src='https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' alt='Morning Routine' />",
        featuredImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metaKeywords: "morning routine, health, productivity, wellness",
    },
    {
        title: "5 Common Gym Mistakes and How to Avoid Them",
        categorySlug: "fitness-exercise",
        subcategorySlug: "gym-training",
        excerpt: "Are you working hard but not seeing results? You might be making one of these 5 common gym mistakes that hinder muscle growth and fat loss.",
        content: "<h2>Maximizing Your Gym Time</h2><p>Going to the gym is only half the battle. Doing the right things while you are there is what counts.</p><h3>1. Skipping Warm-ups</h3><p>Never skip a dynamic routine to prep your muscles and joints.</p><h3>2. Poor Form</h3><p>Lifting too heavy with bad form is a one-way ticket to Snap City.</p><h3>3. Not Tracking Progress</h3><p>If you don't track your lifts, you won't know if you're applying progressive overload.</p><img src='https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' alt='Gym Workout' />",
        featuredImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metaKeywords: "gym, workout, fitness mistakes, muscle building",
    },
    {
        title: "Understanding Cortisol: How to Naturally Lower Stress",
        categorySlug: "mental-health",
        subcategorySlug: "stress-management",
        excerpt: "Cortisol is known as the stress hormone. Chronically high levels can lead to weight gain, anxiety, and sleep issues. Learn how to manage it.",
        content: "<h2>The Role of Cortisol</h2><p>Cortisol isn't entirely bad. It helps you wake up and responds to acute danger. But chronic stress keeps it elevated.</p><h3>How to Lower It</h3><ul><li><strong>Sleep:</strong> Aim for 7-9 hours of quality sleep.</li><li><strong>Meditation:</strong> Mindfulness and deep breathing can drastically lower cortisol.</li><li><strong>Limit Caffeine:</strong> Excessive coffee can spike cortisol levels.</li></ul><img src='https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' alt='Meditation' />",
        featuredImage: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metaKeywords: "cortisol, stress, mental health, relaxation",
    },
    {
        title: "Managing Type 2 Diabetes: Diet and Lifestyle Strategies",
        categorySlug: "diseases",
        subcategorySlug: "diabetes",
        excerpt: "Type 2 diabetes is largely manageable through diet and lifestyle modifications. Here is a comprehensive guide on what to eat and how to live.",
        content: "<h2>Taking Control of Diabetes</h2><p>The key to managing type 2 diabetes is keeping blood sugar levels stable.</p><h3>Dietary Interventions</h3><p>Focus on low glycemic index foods. Protein and fiber are your best friends as they slow sugar absorption.</p><h3>Exercise</h3><p>Physical activity increases insulin sensitivity, meaning your cells can use the available insulin more effectively.</p><img src='https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' alt='Healthy Diet' />",
        featuredImage: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metaKeywords: "diabetes, type 2, blood sugar, health",
    },
    {
        title: "Top 5 Natural Remedies for Better Sleep",
        categorySlug: "wellness-lifestyle",
        subcategorySlug: "natural-remedies",
        excerpt: "Struggling to fall asleep? Before reaching for sleeping pills, try these 5 proven natural remedies that promote deep, restorative sleep.",
        content: "<h2>Natural Sleep Aids</h2><p>Quality sleep is foundational to health. If you're tossing and turning, try these natural interventions.</p><h3>1. Chamomile Tea</h3><p>Contains apigenin, an antioxidant that binds to specific receptors in your brain that may promote sleepiness.</p><h3>2. Magnesium</h3><p>Helps quiet the mind and body, making it easier to fall asleep.</p><h3>3. Lavender Oil</h3><p>Aromatherapy with lavender can improve sleep quality and ease mild insomnia.</p><img src='https://images.unsplash.com/photo-1511295742362-92c96b124e52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' alt='Sleep' />",
        featuredImage: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metaKeywords: "sleep, insomnia, natural remedies, nighttime routine",
    },
    {
        title: "Quick and Nutritious Breakfast Ideas",
        categorySlug: "diet-nutrition",
        subcategorySlug: "healthy-recipes",
        excerpt: "Short on time in the mornings? These 5 quick and highly nutritious breakfast recipes will keep you energized until lunch.",
        content: "<h2>Fuel Your Morning</h2><p>Skipping breakfast can lead to overeating later. Try these 5-minute meals.</p><h3>Overnight Oats</h3><p>Mix rolled oats, chia seeds, and almond milk in a jar. Leave overnight. Top with berries in the morning.</p><h3>Avocado Toast with Egg</h3><p>Whole grain toast, mashed avocado, and a poached egg. High in protein and healthy fats.</p><h3>Green Smoothie</h3><p>Blend spinach, half a banana, protein powder, and unsweetened milk.</p><img src='https://images.unsplash.com/photo-1494390248081-4e521a5940db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' alt='Breakfast' />",
        featuredImage: "https://images.unsplash.com/photo-1494390248081-4e521a5940db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metaKeywords: "breakfast, healthy recipes, nutrition, quick meals",
    },
    {
        title: "10 Basic Yoga Poses for Complete Beginners",
        categorySlug: "fitness-exercise",
        subcategorySlug: "yoga",
        excerpt: "Never tried yoga before? Don't worry, start with these 10 fundamental poses to build strength, flexibility, and mind-body connection.",
        content: "<h2>Starting Your Yoga Journey</h2><p>Yoga is for everyone. Let's cover the basics.</p><ul><li><strong>Downward-Facing Dog:</strong> Great for stretching the hamstrings and calves.</li><li><strong>Child’s Pose:</strong> A resting posture that gently stretches the hips, thighs, and ankles.</li><li><strong>Warrior I:</strong> Builds core strength and stretches the chest and lungs.</li><li><strong>Tree Pose:</strong> Improves balance and focus.</li></ul><img src='https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' alt='Yoga' />",
        featuredImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metaKeywords: "yoga, beginners, flexibility, fitness",
    },
    {
        title: "Why Yearly Checkups Can Save Your Life",
        categorySlug: "health",
        subcategorySlug: "preventive-care",
        excerpt: "Many serious health conditions go unnoticed until it's too late. Discover why annual preventive health screenings are non-negotiable.",
        content: "<h2>The Value of Prevention</h2><p>Catching a disease early is often the difference between a simple treatment and a life-threatening battle.</p><h3>Key Screenings to Ask For:</h3><ul><li>Blood pressure check</li><li>Cholesterol profile</li><li>Blood sugar/A1C</li><li>Cancer screenings (based on age and gender)</li></ul><img src='https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' alt='Doctor Checkup' />",
        featuredImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metaKeywords: "preventive care, health checkup, doctor visit",
    },
    {
        title: "No-Equipment Home Workout for Full Body Strength",
        categorySlug: "fitness-exercise",
        subcategorySlug: "home-workouts",
        excerpt: "No gym membership? No problem. This intense but accessible full-body workout requires zero equipment and can be done from your living room.",
        content: "<h2>Bodyweight Training</h2><p>Your own body is an excellent piece of exercise equipment.</p><h3>The Circuit</h3><p>Perform each exercise for 45 seconds, followed by 15 seconds of rest. Do 4 rounds.</p><ol><li>Push-ups</li><li>Bodyweight Squats</li><li>Plank</li><li>Lunges</li><li>Burpees</li></ol><img src='https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' alt='Home Workout' />",
        featuredImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metaKeywords: "home workout, bodyweight, fitness, exercise",
    },
    {
        title: "Coping Mechanisms for Daily Anxiety",
        categorySlug: "mental-health",
        subcategorySlug: "anxiety",
        excerpt: "Anxiety can feel paralyzing. Empower yourself with these actionable coping mechanisms designed to ground you when you feel overwhelmed.",
        content: "<h2>Grounding Yourself</h2><p>When anxiety hits, your brain goes into overdrive. The key is to signal to your brain that you are safe.</p><h3>The 5-4-3-2-1 Technique</h3><p>Look around and identify: 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.</p><h3>Deep Diaphragmatic Breathing</h3><p>Breathe in for 4 seconds, hold for 4, exhale for 6. This activates the parasympathetic nervous system.</p><img src='https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' alt='Anxiety Relief' />",
        featuredImage: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metaKeywords: "anxiety, mental health, coping, stress",
    },
    {
        title: "Heart-Healthy Habits to Start Today",
        categorySlug: "diseases",
        subcategorySlug: "heart-disease",
        excerpt: "Heart disease remains the leading cause of death globally. Fortunately, simple lifestyle changes can dramatically lower your risk.",
        content: "<h2>Protecting Your Engine</h2><p>The heart is an incredible organ, but it needs maintenance.</p><ul><li><strong>Quit Smoking:</strong> The single best thing you can do for your heart.</li><li><strong>Eat Healthy Fats:</strong> Opt for olive oil, avocados, and fatty fish over trans fats.</li><li><strong>Stay Active:</strong> Just 30 minutes of walking a day makes a massive difference.</li></ul><img src='https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' alt='Healthy Heart' />",
        featuredImage: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metaKeywords: "heart disease, heart health, cardiovascular, diet",
    },
    {
        title: "Do You Really Need a Multivitamin?",
        categorySlug: "diet-nutrition",
        subcategorySlug: "vitamins-supplements",
        excerpt: "Should you take a daily multivitamin? We dive into the science to see who actually benefits from supplementation and who is just making expensive urine.",
        content: "<h2>The Truth About Supplements</h2><p>For most healthy people eating a diverse, nutrient-rich diet, a multivitamin is likely unnecessary.</p><h3>Who Needs Them?</h3><ul><li>Pregnant individuals (folic acid)</li><li>Older adults (B12 and Vitamin D)</li><li>People on restrictive diets (vegans often need B12)</li></ul><p>Always prioritize getting vitamins from whole foods first.</p><img src='https://images.unsplash.com/photo-1584308666744-24d5e1dc2054?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' alt='Vitamins' />",
        featuredImage: "https://images.unsplash.com/photo-1584308666744-24d5e1dc2054?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metaKeywords: "multivitamin, supplements, nutrition, health",
    },
    {
        title: "Essential Nutrition Tips for Women over 40",
        categorySlug: "health",
        subcategorySlug: "womens-health",
        excerpt: "As women enter their 40s, metabolic and hormonal shifts require a change in nutritional strategy. Here is exactly what you need to focus on.",
        content: "<h2>Navigating Your 40s</h2><p>Metabolism naturally slows down, and estrogen levels begin to fluctuate.</p><h3>Key Nutrients:</h3><ul><li><strong>Calcium & Vitamin D:</strong> Crucial for maintaining bone density.</li><li><strong>Protein:</strong> Essential to prevent age-related muscle loss.</li><li><strong>Phytoestrogens:</strong> Foods like flaxseeds and soy may help balance hormones.</li></ul><img src='https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' alt='Women Health' />",
        featuredImage: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metaKeywords: "women health, nutrition, aging, wellness",
    },
    {
        title: "How Hydration Affects Your Productivity",
        categorySlug: "wellness-lifestyle",
        subcategorySlug: "daily-healthy-habits",
        excerpt: "Feeling sluggish at work? Before you grab another coffee, try drinking a large glass of water. Even mild dehydration can wreck your cognitive focus.",
        content: "<h2>Water and Brain Function</h2><p>Your brain is over 70% water. When you're dehydrated, brain function slows down.</p><h3>Signs of Dehydration</h3><p>Brain fog, mild headaches, and afternoon fatigue are classic signs.</p><h3>The Fix</h3><p>Keep a reusable water bottle on your desk. Aim for at least 8 glasses a day, more if you exercise or live in a hot climate.</p><img src='https://images.unsplash.com/photo-1548839140-29a749e1bc4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' alt='Water Bottle' />",
        featuredImage: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metaKeywords: "hydration, productivity, water, wellness",
    },
    {
        title: "A 7-Day Mediterranean Diet Meal Plan",
        categorySlug: "diet-nutrition",
        subcategorySlug: "meal-plans",
        excerpt: "The Mediterranean diet is consistently ranked as the healthiest in the world. Get started today with this comprehensive, easy-to-follow 7-day meal plan.",
        content: "<h2>Eating Like a Mediterranean</h2><p>Focus on olive oil, fresh vegetables, whole grains, and lean proteins like fish.</p><h3>Day 1 Example:</h3><p><strong>Breakfast:</strong> Greek yogurt with honey and walnuts.<br/><strong>Lunch:</strong> Quinoa salad with cherry tomatoes, feta, and olives.<br/><strong>Dinner:</strong> Baked salmon with asparagus and a side of farro.</p><p>Stick to this structure and you'll feel better in no time.</p><img src='https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' alt='Mediterranean Food' />",
        featuredImage: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metaKeywords: "mediterranean diet, meal plan, healthy eating",
    },
    {
        title: "HIIT vs. Steady State Cardio: Which is Better?",
        categorySlug: "fitness-exercise",
        subcategorySlug: "cardio",
        excerpt: "The age-old fitness debate: High-Intensity Interval Training or steady, low-intensity cardio? We break down the pros and cons of each.",
        content: "<h2>Cardio Explained</h2><p>Both forms of exercise have immense benefits for your cardiovascular system.</p><h3>HIIT (High-Intensity Interval Training)</h3><p>Pros: Time-efficient, burns calories post-workout.<br/>Cons: High impact, harder to recover from.</p><h3>Steady State (LISS)</h3><p>Pros: Great for recovery, easy on the joints.<br/>Cons: Takes more time to burn the same amount of calories.</p><img src='https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' alt='Running' />",
        featuredImage: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metaKeywords: "HIIT, cardio, fitness, running",
    },
    {
        title: "The Science of Sleep: Why You Need 8 Hours",
        categorySlug: "mental-health",
        subcategorySlug: "sleep-health",
        excerpt: "Hustle culture often glorifies sleep deprivation, but science shows that chronic lack of sleep damages your brain and body significantly.",
        content: "<h2>What Happens When You Sleep</h2><p>Sleep is when your brain clears out metabolic waste and your body repairs damaged tissues.</p><ul><li><strong>Memory Consolidation:</strong> Learning happens during deep sleep.</li><li><strong>Immune Function:</strong> Lack of sleep severely depresses your immune system.</li></ul><p>Make 7-8 hours a non-negotiable priority.</p><img src='https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' alt='Sleeping' />",
        featuredImage: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metaKeywords: "sleep, health, recovery, mental well-being",
    }
];

async function seedPosts() {
    console.log('Fetching categories...');
    const categories = await prisma.category.findMany();

    console.log(`Found ${categories.length} categories. Inserting posts...`);

    let count = 0;
    for (const p of dummyPosts) {
        const category = categories.find(c => c.slug === p.categorySlug && !c.parentId);
        const subcategory = categories.find(c => c.slug === p.subcategorySlug && c.parentId === category?.id);

        if (category) {
            const slug = generateSlug(p.title);
            await prisma.post.upsert({
                where: { slug },
                update: {},
                create: {
                    title: p.title,
                    slug: slug,
                    content: p.content,
                    excerpt: p.excerpt,
                    featuredImage: p.featuredImage,
                    categoryId: category.id,
                    subcategoryId: subcategory ? subcategory.id : null,
                    metaTitle: p.title,
                    metaDescription: p.excerpt.substring(0, 150),
                    metaKeywords: p.metaKeywords,
                    status: 'published',
                    views: Math.floor(Math.random() * 500),
                    commentsEnabled: true,
                }
            });
            count++;
        } else {
            console.log(`Could not find category for post: ${p.title} (slug: ${p.categorySlug})`);
        }
    }

    console.log(`✅ Successfully seeded ${count} dummy blog posts.`);
}

seedPosts()
    .catch((e) => {
        console.error('Error seeding posts:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
