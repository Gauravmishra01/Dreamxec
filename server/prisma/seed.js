import { PrismaClient, ProjectStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // ⚠️ Replace this with a real donor ID from your DB
    const DEMO_DONOR_ID = "699e20de61927ba4c902629b"

    // Optional: Clean previous demo projects
    // 2️⃣ Clean existing demo projects safely
    await prisma.donorProject.deleteMany({
        where: {
            organization: {
                in: [
                    "GreenFuture Foundation",
                    "EduInfra Initiative",
                    "NextGen Talent Fund",
                    "Healthcare Innovation Trust",
                    "Digital Democracy Lab",
                    "AgriTech Impact Fund",
                    "Urban Innovation Council",
                    "FinTech Youth Fund",
                    "Climate Action Alliance",
                    "SpaceTech Student Program",
                    "Rural Empowerment Trust",
                    "EdTech Development Board",
                    "CyberSecure India",
                    "Mobility Innovation Lab",
                    "Women in Tech Grant"
                ]
            }
        }
    })

    const projects = [
        {
            title: "AI-Based Smart Waste Management for College Campuses",
            description:
                "Design and deploy an AI + IoT powered smart waste segregation system using computer vision-enabled smart bins. The solution will automatically classify biodegradable, recyclable, and hazardous waste while providing real-time fill-level monitoring. A centralized dashboard will optimize waste collection routes and provide sustainability analytics. Target impact: 40% reduction in landfill waste within 6 months.",
            organization: "GreenFuture Foundation",
            skillsRequired: ["IoT", "Computer Vision", "Embedded Systems", "Node.js"],
            timeline: "4-6 Months",
            totalBudget: 250000,
            allocatedFunds: 80000,
            imageUrl: null,
            status: ProjectStatus.APPROVED
        },

        {
            title: "Solar-Powered Smart Study Pods",
            description:
                "Develop modular, solar-powered outdoor study pods equipped with WiFi, smart lighting, ventilation, and device charging ports. Each pod will operate fully on renewable energy and include IoT-based energy monitoring to track efficiency. The initiative promotes sustainable infrastructure while addressing campus space constraints.",
            organization: "EduInfra Initiative",
            skillsRequired: ["Electrical Engineering", "Solar Systems", "AutoCAD"],
            timeline: "3 Months",
            totalBudget: 180000,
            allocatedFunds: 50000,
            imageUrl: "https://images.unsplash.com/photo-1509395176047-4a66953fd231",
            status: ProjectStatus.APPROVED
        },

        {
            title: "AI Career Prediction & Resume Intelligence Platform",
            description:
                "Build an NLP-powered resume intelligence platform that analyzes student profiles, predicts career paths, identifies skill gaps, and recommends personalized learning roadmaps. The system will include resume parsing, AI-driven job-fit scoring, and analytics dashboards for placement cells.",
            organization: "NextGen Talent Fund",
            skillsRequired: ["Python", "NLP", "Machine Learning", "MongoDB"],
            timeline: "5 Months",
            totalBudget: 320000,
            allocatedFunds: 100000,
            imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
            status: ProjectStatus.APPROVED
        },

        {
            title: "Low-Cost Smart Prosthetic Arm",
            description:
                "Prototype an affordable EMG-based smart prosthetic arm using embedded sensors and 3D printing technology. The goal is to maintain manufacturing cost under ₹10,000 while delivering functional grip accuracy and motion control. Deliverables include prototype validation and usability testing.",
            organization: "Healthcare Innovation Trust",
            skillsRequired: ["Biomedical Engineering", "Arduino", "3D Printing"],
            timeline: "6 Months",
            totalBudget: 400000,
            allocatedFunds: 120000,
            imageUrl: null,

            status: ProjectStatus.APPROVED
        },

        {
            title: "Blockchain-Based Campus Voting System",
            description:
                "Develop a decentralized voting system using blockchain and smart contracts to ensure transparency, immutability, and tamper-proof student elections. The platform will feature secure voter authentication and real-time vote tracking dashboards.",
            organization: "Digital Democracy Lab",
            skillsRequired: ["Blockchain", "Solidity", "Web3.js"],
            timeline: "4 Months",
            totalBudget: 275000,
            allocatedFunds: 70000,
            imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
            status: ProjectStatus.APPROVED
        },

        {
            title: "Smart Irrigation System for Rural Farmers",
            description:
                "Develop an IoT-based soil monitoring system that automates irrigation based on moisture and weather data. The system aims to reduce water consumption by 30% while improving crop yield consistency.",
            organization: "AgriTech Impact Fund",
            skillsRequired: ["IoT", "Data Analytics", "Sensors"],
            timeline: "5 Months",
            totalBudget: 210000,
            allocatedFunds: 60000,
            imageUrl: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
            status: ProjectStatus.APPROVED
        },

        {
            title: "EV Charging Stations for Campus",
            description:
                "Design and implement low-cost EV charging infrastructure for electric bikes and scooters within campus premises. The system will include smart metering and prepaid usage tracking to promote sustainable transportation.",
            organization: "Urban Innovation Council",
            skillsRequired: ["Electrical Systems", "Power Electronics"],
            timeline: "4 Months",
            totalBudget: 350000,
            allocatedFunds: 150000,
imageUrl: null,
            status: ProjectStatus.APPROVED
        },

        {
            title: "Student FinTech Budgeting App",
            description:
                "Develop a mobile-first budgeting and micro-investment application tailored for students. The app will provide real-time expense tracking, AI-based savings insights, and financial literacy resources.",
            organization: "FinTech Youth Fund",
            skillsRequired: ["React Native", "FinTech APIs", "Node.js"],
            timeline: "3 Months",
            totalBudget: 160000,
            allocatedFunds: 45000,
imageUrl: null,
            status: ProjectStatus.APPROVED
        },

        {
            title: "Carbon Footprint Tracking App",
            description:
                "Build a gamified mobile application that tracks individual daily carbon emissions based on lifestyle inputs. The app will calculate eco-scores and encourage sustainable behavior through leaderboards and challenges.",
            organization: "Climate Action Alliance",
            skillsRequired: ["Flutter", "APIs", "Data Analytics"],
            timeline: "3 Months",
            totalBudget: 140000,
            allocatedFunds: 40000,
            imageUrl: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1",
            status: ProjectStatus.APPROVED
        },

        {
            title: "Student CubeSat Prototype",
            description:
                "Support the development of a student-built CubeSat prototype for atmospheric research. The project includes embedded systems design, payload integration, telemetry communication, and ground station setup.",
            organization: "SpaceTech Student Program",
            skillsRequired: ["Aerospace Engineering", "Embedded Systems"],
            timeline: "8 Months",
            totalBudget: 600000,
            allocatedFunds: 200000,
            imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa",
            status: ProjectStatus.APPROVED
        },

        {
            title: "Rural E-Learning Offline Server",
            description:
                "Deploy offline digital learning servers in rural schools to provide uninterrupted access to educational content without requiring constant internet connectivity.",
            organization: "Rural Empowerment Trust",
            skillsRequired: ["Linux", "Networking", "EdTech"],
            timeline: "4 Months",
            totalBudget: 190000,
            allocatedFunds: 50000,
            imageUrl: "https://images.unsplash.com/photo-1588072432836-e10032774350",
            status: ProjectStatus.APPROVED
        },

        {
            title: "AI-Based Attendance via Face Recognition",
            description:
                "Develop a secure facial recognition attendance system capable of processing large classroom environments with real-time accuracy and anti-spoofing detection.",
            organization: "EdTech Development Board",
            skillsRequired: ["Python", "OpenCV", "AI"],
            timeline: "4 Months",
            totalBudget: 230000,
            allocatedFunds: 75000,
            imageUrl: "https://images.unsplash.com/photo-1581090700227-1e8e0a9f63c8",
            status: ProjectStatus.APPROVED
        },

        {
            title: "Campus Cybersecurity Monitoring Tool",
            description:
                "Build a centralized cybersecurity monitoring dashboard integrating log aggregation, anomaly detection, and automated threat alert systems for university networks.",
            organization: "CyberSecure India",
            skillsRequired: ["Cybersecurity", "SIEM", "Backend Development"],
            timeline: "5 Months",
            totalBudget: 300000,
            allocatedFunds: 90000,
            imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
            status: ProjectStatus.APPROVED
        },

        {
            title: "Autonomous Campus Delivery Robot",
            description:
                "Prototype a ROS-based autonomous robot capable of intra-campus navigation and parcel delivery with obstacle detection and real-time tracking via mobile application.",
            organization: "Mobility Innovation Lab",
            skillsRequired: ["Robotics", "ROS", "Computer Vision"],
            timeline: "6 Months",
            totalBudget: 450000,
            allocatedFunds: 160000,
            imageUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc",
            status: ProjectStatus.APPROVED
        },

        {
            title: "Women-in-Tech AI Mentorship Platform",
            description:
                "Develop an AI-powered mentorship platform connecting female students with industry mentors in AI and technology domains. Features include smart mentor matching, session tracking, and career progression analytics.",
            organization: "Women in Tech Grant",
            skillsRequired: ["Full Stack Development", "AI Matching Algorithm"],
            timeline: "4 Months",
            totalBudget: 175000,
            allocatedFunds: 60000,
            imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
            status: ProjectStatus.APPROVED
        }
    ]

    for (const project of projects) {
        await prisma.donorProject.create({
            data: {
                ...project,
                donorId: DEMO_DONOR_ID
            }
        })
    }

    console.log("✅ 15 Demo Donor Projects Seeded Successfully")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })