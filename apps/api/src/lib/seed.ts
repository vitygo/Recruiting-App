import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const DEMO_EMAIL = 'demo@recruitapex.com'

async function seedDemoUser() {
  const passwordHash = await bcrypt.hash('demo123', 10)
  return prisma.user.create({
    data: {
      email: DEMO_EMAIL,
      name: 'Viktor',
      passwordHash,
      role: 'RECRUITER',
    },
  })
}

async function seedJobs(userId: string) {
  const jobs = await prisma.job.createMany({
    data: [
      {
        id: 'demo-job-1',
        title: 'Senior React Developer',
        department: 'Engineering',
        location: 'Remote',
        type: 'FULL_TIME',
        salaryMin: 110000,
        salaryMax: 150000,
        description: 'Build next-gen web apps with React and TypeScript.',
        techStack: JSON.stringify(['React', 'TypeScript', 'GraphQL', 'Node.js']),
        status: 'ACTIVE',
        userId,
        createdAt: new Date('2026-05-01T00:00:00Z'),
      },
      {
        id: 'demo-job-2',
        title: 'DevOps Engineer',
        department: 'Infrastructure',
        location: 'New York, NY',
        type: 'FULL_TIME',
        salaryMin: 100000,
        salaryMax: 135000,
        description: 'Own CI/CD pipelines, K8s clusters, and cloud infra.',
        techStack: JSON.stringify(['Kubernetes', 'Terraform', 'AWS', 'Docker']),
        status: 'OPEN',
        userId,
        createdAt: new Date('2026-05-02T00:00:00Z'),
      },
      {
        id: 'demo-job-3',
        title: 'Product Designer',
        department: 'Design',
        location: 'San Francisco, CA',
        type: 'FULL_TIME',
        salaryMin: 95000,
        salaryMax: 125000,
        description: 'Craft user experiences from concept to pixel-perfect delivery.',
        techStack: JSON.stringify(['Figma', 'Prototyping', 'User Research']),
        status: 'OPEN',
        userId,
        createdAt: new Date('2026-05-03T00:00:00Z'),
      },
      {
        id: 'demo-job-4',
        title: 'Frontend Engineer',
        department: 'Engineering',
        location: 'Remote',
        type: 'FULL_TIME',
        salaryMin: 85000,
        salaryMax: 110000,
        description: 'Delivered and closed — position has been filled.',
        techStack: JSON.stringify(['React', 'CSS', 'JavaScript']),
        status: 'CLOSED',
        userId,
        createdAt: new Date('2026-05-04T00:00:00Z'),
      },
    ],
  })
  return jobs
}

async function seedCandidates(userId: string) {
  const candidates = [
    { id: 'dc-1',  firstName: 'Alex',     lastName: 'Johnson',  email: 'alex.johnson@mail.com',    phone: '+1 212 555 0101', location: 'New York, NY',       source: 'LINKEDIN',     createdAt: new Date('2026-05-20T00:00:00Z') },
    { id: 'dc-2',  firstName: 'Sara',     lastName: 'Nguyen',   email: 'sara.nguyen@mail.com',     phone: '+1 415 555 0102', location: 'San Francisco, CA',  source: 'INDEED',       createdAt: new Date('2026-05-20T00:00:00Z') },
    { id: 'dc-3',  firstName: 'James',    lastName: 'Park',     email: 'james.park@mail.com',      phone: '+1 650 555 0103', location: 'Palo Alto, CA',      source: 'REFERRAL',     createdAt: new Date('2026-05-20T00:00:00Z') },
    { id: 'dc-4',  firstName: 'Emily',    lastName: 'Chen',     email: 'emily.chen@mail.com',      phone: '+1 408 555 0104', location: 'Remote',             source: 'LINKEDIN',     createdAt: new Date('2026-05-20T00:00:00Z') },
    { id: 'dc-5',  firstName: 'Michael',  lastName: 'Torres',   email: 'michael.torres@mail.com',  phone: '+1 646 555 0105', location: 'Brooklyn, NY',       source: 'REFERRAL',     createdAt: new Date('2026-05-20T00:00:00Z') },
    { id: 'dc-6',  firstName: 'Priya',    lastName: 'Sharma',   email: 'priya.sharma@mail.com',    phone: '+1 332 555 0106', location: 'Austin, TX',         source: 'LINKEDIN',     createdAt: new Date('2026-05-20T00:00:00Z') },
    { id: 'dc-7',  firstName: 'Daniel',   lastName: 'Kim',      email: 'daniel.kim@mail.com',      phone: '+1 212 555 0107', location: 'New York, NY',       source: 'INDEED',       createdAt: new Date('2026-05-20T00:00:00Z') },
    { id: 'dc-8',  firstName: 'Olivia',   lastName: 'Martinez', email: 'olivia.martinez@mail.com', phone: '+1 917 555 0108', location: 'Remote',             source: 'REFERRAL',     createdAt: new Date('2026-05-20T00:00:00Z') },
    { id: 'dc-9',  firstName: 'Liam',     lastName: 'Wilson',   email: 'liam.wilson@mail.com',     phone: '+1 718 555 0109', location: 'Queens, NY',         source: 'MANUAL',       createdAt: new Date('2026-05-20T00:00:00Z') },
    { id: 'dc-10', firstName: 'Zoe',      lastName: 'Adams',    email: 'zoe.adams@mail.com',       phone: '+1 415 555 0110', location: 'San Francisco, CA',  source: 'CAREERS_PAGE', createdAt: new Date('2026-05-20T00:00:00Z') },
    { id: 'dc-11', firstName: 'Noah',     lastName: 'Lee',      email: 'noah.lee@mail.com',        phone: '+1 650 555 0111', location: 'Menlo Park, CA',     source: 'LINKEDIN',     createdAt: new Date('2026-05-20T00:00:00Z') },
    { id: 'dc-12', firstName: 'Isabella', lastName: 'Brown',    email: 'isabella.brown@mail.com',  phone: '+1 510 555 0112', location: 'Oakland, CA',        source: 'REFERRAL',     createdAt: new Date('2026-05-20T00:00:00Z') },
  ]

  await prisma.candidate.createMany({
    data: candidates.map(c => ({ ...c, userId })),
  })
}

async function seedPipeline() {
  await prisma.candidateJob.createMany({
    data: [
      // Senior React Developer
      { id: 'dcj-1',  candidateId: 'dc-1',  jobId: 'demo-job-1', stage: 'APPLIED',   aiScore: 72, aiReason: 'Strong TypeScript background',         createdAt: new Date('2026-05-21T00:00:00Z'), updatedAt: new Date('2026-05-21T00:00:00Z') },
      { id: 'dcj-2',  candidateId: 'dc-2',  jobId: 'demo-job-1', stage: 'APPLIED',   aiScore: 58, aiReason: 'React exp, limited TS',               createdAt: new Date('2026-05-22T00:00:00Z'), updatedAt: new Date('2026-05-22T00:00:00Z') },
      { id: 'dcj-3',  candidateId: 'dc-3',  jobId: 'demo-job-1', stage: 'SCREENING', aiScore: 85, aiReason: '5 yrs React, open source contributor', createdAt: new Date('2026-05-25T00:00:00Z'), updatedAt: new Date('2026-05-25T00:00:00Z') },
      { id: 'dcj-4',  candidateId: 'dc-4',  jobId: 'demo-job-1', stage: 'INTERVIEW', aiScore: 91, aiReason: 'Senior React, system design exp',      createdAt: new Date('2026-05-27T00:00:00Z'), updatedAt: new Date('2026-05-27T00:00:00Z') },
      { id: 'dcj-5',  candidateId: 'dc-5',  jobId: 'demo-job-1', stage: 'OFFER',     aiScore: 94, aiReason: 'Exceptional React + GraphQL',          createdAt: new Date('2026-05-29T00:00:00Z'), updatedAt: new Date('2026-05-29T00:00:00Z') },
      // DevOps Engineer
      { id: 'dcj-6',  candidateId: 'dc-6',  jobId: 'demo-job-2', stage: 'APPLIED',   aiScore: 65, aiReason: 'AWS certified, limited K8s',           createdAt: new Date('2026-05-18T00:00:00Z'), updatedAt: new Date('2026-05-18T00:00:00Z') },
      { id: 'dcj-7',  candidateId: 'dc-7',  jobId: 'demo-job-2', stage: 'SCREENING', aiScore: 78, aiReason: 'K8s + Terraform expert',              createdAt: new Date('2026-05-23T00:00:00Z'), updatedAt: new Date('2026-05-23T00:00:00Z') },
      { id: 'dcj-8',  candidateId: 'dc-8',  jobId: 'demo-job-2', stage: 'INTERVIEW', aiScore: 88, aiReason: 'CI/CD automation & GitOps',           createdAt: new Date('2026-05-26T00:00:00Z'), updatedAt: new Date('2026-05-26T00:00:00Z') },
      { id: 'dcj-9',  candidateId: 'dc-9',  jobId: 'demo-job-2', stage: 'REJECTED',  aiScore: 42, aiReason: 'Limited cloud exp', rejectionReason: 'Does not meet minimum cloud infra requirements', createdAt: new Date('2026-05-16T00:00:00Z'), updatedAt: new Date('2026-05-16T00:00:00Z') },
      // Product Designer
      { id: 'dcj-10', candidateId: 'dc-10', jobId: 'demo-job-3', stage: 'APPLIED',   aiScore: 70, aiReason: 'Figma proficient, UX portfolio',      createdAt: new Date('2026-05-24T00:00:00Z'), updatedAt: new Date('2026-05-24T00:00:00Z') },
      { id: 'dcj-11', candidateId: 'dc-11', jobId: 'demo-job-3', stage: 'SCREENING', aiScore: 82, aiReason: 'Strong product sense, motion design', createdAt: new Date('2026-05-28T00:00:00Z'), updatedAt: new Date('2026-05-28T00:00:00Z') },
      { id: 'dcj-12', candidateId: 'dc-12', jobId: 'demo-job-3', stage: 'HIRED',     aiScore: 96, aiReason: 'Exceptional portfolio, cultural fit', createdAt: new Date('2026-05-31T00:00:00Z'), updatedAt: new Date('2026-05-31T00:00:00Z') },
    ],
  })
}

// Seeds a rich demo workspace for any newly registered user.
// Uses auto-generated IDs so multiple users can coexist without conflicts.
export async function seedForUser(userId: string): Promise<void> {
  console.log(`Seeding demo workspace for user ${userId}…`)
  try {
    // Step 1: jobs (capture IDs for downstream relations)
    const [job1, job2, job3] = await Promise.all([
      prisma.job.create({ data: {
        title: 'Senior React Developer',
        department: 'Engineering',
        location: 'Remote',
        type: 'FULL_TIME',
        salaryMin: 110000,
        salaryMax: 150000,
        description: 'Build next-gen web apps with React and TypeScript.',
        techStack: JSON.stringify(['React', 'TypeScript', 'GraphQL', 'Node.js']),
        status: 'ACTIVE',
        userId,
        createdAt: new Date('2026-05-01T00:00:00Z'),
      }}),
      prisma.job.create({ data: {
        title: 'DevOps Engineer',
        department: 'Infrastructure',
        location: 'New York, NY',
        type: 'FULL_TIME',
        salaryMin: 100000,
        salaryMax: 135000,
        description: 'Own CI/CD pipelines, K8s clusters, and cloud infra.',
        techStack: JSON.stringify(['Kubernetes', 'Terraform', 'AWS', 'Docker']),
        status: 'OPEN',
        userId,
        createdAt: new Date('2026-05-02T00:00:00Z'),
      }}),
      prisma.job.create({ data: {
        title: 'Product Designer',
        department: 'Design',
        location: 'San Francisco, CA',
        type: 'FULL_TIME',
        salaryMin: 95000,
        salaryMax: 125000,
        description: 'Craft user experiences from concept to pixel-perfect delivery.',
        techStack: JSON.stringify(['Figma', 'Prototyping', 'User Research']),
        status: 'OPEN',
        userId,
        createdAt: new Date('2026-05-03T00:00:00Z'),
      }}),
    ])

    // Closed job — no pipeline entries needed
    await prisma.job.create({ data: {
      title: 'Frontend Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'FULL_TIME',
      salaryMin: 85000,
      salaryMax: 110000,
      description: 'Delivered and closed — position has been filled.',
      techStack: JSON.stringify(['React', 'CSS', 'JavaScript']),
      status: 'CLOSED',
      userId,
      createdAt: new Date('2026-05-04T00:00:00Z'),
    }})

    // Step 2: candidates (capture IDs for relations)
    const candidateRows = [
      { firstName: 'Alex',     lastName: 'Johnson',  email: 'alex.johnson@mail.com',    phone: '+1 212 555 0101', location: 'New York, NY',      source: 'LINKEDIN'     },
      { firstName: 'Sara',     lastName: 'Nguyen',   email: 'sara.nguyen@mail.com',     phone: '+1 415 555 0102', location: 'San Francisco, CA', source: 'INDEED'       },
      { firstName: 'James',    lastName: 'Park',     email: 'james.park@mail.com',      phone: '+1 650 555 0103', location: 'Palo Alto, CA',     source: 'REFERRAL'     },
      { firstName: 'Emily',    lastName: 'Chen',     email: 'emily.chen@mail.com',      phone: '+1 408 555 0104', location: 'Remote',            source: 'LINKEDIN'     },
      { firstName: 'Michael',  lastName: 'Torres',   email: 'michael.torres@mail.com',  phone: '+1 646 555 0105', location: 'Brooklyn, NY',      source: 'REFERRAL'     },
      { firstName: 'Priya',    lastName: 'Sharma',   email: 'priya.sharma@mail.com',    phone: '+1 332 555 0106', location: 'Austin, TX',        source: 'LINKEDIN'     },
      { firstName: 'Daniel',   lastName: 'Kim',      email: 'daniel.kim@mail.com',      phone: '+1 212 555 0107', location: 'New York, NY',      source: 'INDEED'       },
      { firstName: 'Olivia',   lastName: 'Martinez', email: 'olivia.martinez@mail.com', phone: '+1 917 555 0108', location: 'Remote',            source: 'REFERRAL'     },
      { firstName: 'Liam',     lastName: 'Wilson',   email: 'liam.wilson@mail.com',     phone: '+1 718 555 0109', location: 'Queens, NY',        source: 'MANUAL'       },
      { firstName: 'Zoe',      lastName: 'Adams',    email: 'zoe.adams@mail.com',       phone: '+1 415 555 0110', location: 'San Francisco, CA', source: 'CAREERS_PAGE' },
      { firstName: 'Noah',     lastName: 'Lee',      email: 'noah.lee@mail.com',        phone: '+1 650 555 0111', location: 'Menlo Park, CA',    source: 'LINKEDIN'     },
      { firstName: 'Isabella', lastName: 'Brown',    email: 'isabella.brown@mail.com',  phone: '+1 510 555 0112', location: 'Oakland, CA',       source: 'REFERRAL'     },
    ]

    const candidates = await Promise.all(
      candidateRows.map(c =>
        prisma.candidate.create({ data: { ...c, userId, createdAt: new Date('2026-05-20T00:00:00Z') } })
      )
    )
    const [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12] = candidates

    // Step 3: pipeline
    await prisma.candidateJob.createMany({
      data: [
        // Senior React Developer
        { candidateId: c1.id,  jobId: job1.id, stage: 'APPLIED',   aiScore: 72, aiReason: 'Strong TypeScript background',         createdAt: new Date('2026-05-21T00:00:00Z') },
        { candidateId: c2.id,  jobId: job1.id, stage: 'APPLIED',   aiScore: 58, aiReason: 'React exp, limited TS',               createdAt: new Date('2026-05-22T00:00:00Z') },
        { candidateId: c3.id,  jobId: job1.id, stage: 'SCREENING', aiScore: 85, aiReason: '5 yrs React, open source contributor', createdAt: new Date('2026-05-25T00:00:00Z') },
        { candidateId: c4.id,  jobId: job1.id, stage: 'INTERVIEW', aiScore: 91, aiReason: 'Senior React, system design exp',      createdAt: new Date('2026-05-27T00:00:00Z') },
        { candidateId: c5.id,  jobId: job1.id, stage: 'OFFER',     aiScore: 94, aiReason: 'Exceptional React + GraphQL',          createdAt: new Date('2026-05-29T00:00:00Z') },
        // DevOps Engineer
        { candidateId: c6.id,  jobId: job2.id, stage: 'APPLIED',   aiScore: 65, aiReason: 'AWS certified, limited K8s',           createdAt: new Date('2026-05-18T00:00:00Z') },
        { candidateId: c7.id,  jobId: job2.id, stage: 'SCREENING', aiScore: 78, aiReason: 'K8s + Terraform expert',              createdAt: new Date('2026-05-23T00:00:00Z') },
        { candidateId: c8.id,  jobId: job2.id, stage: 'INTERVIEW', aiScore: 88, aiReason: 'CI/CD automation & GitOps',           createdAt: new Date('2026-05-26T00:00:00Z') },
        { candidateId: c9.id,  jobId: job2.id, stage: 'REJECTED',  aiScore: 42, aiReason: 'Limited cloud exp', rejectionReason: 'Does not meet minimum cloud infra requirements', createdAt: new Date('2026-05-16T00:00:00Z') },
        // Product Designer
        { candidateId: c10.id, jobId: job3.id, stage: 'APPLIED',   aiScore: 70, aiReason: 'Figma proficient, UX portfolio',      createdAt: new Date('2026-05-24T00:00:00Z') },
        { candidateId: c11.id, jobId: job3.id, stage: 'SCREENING', aiScore: 82, aiReason: 'Strong product sense, motion design', createdAt: new Date('2026-05-28T00:00:00Z') },
        { candidateId: c12.id, jobId: job3.id, stage: 'HIRED',     aiScore: 96, aiReason: 'Exceptional portfolio, cultural fit', createdAt: new Date('2026-05-31T00:00:00Z') },
      ],
    })

    // Step 4: interviews — scheduled relative to now so they always appear upcoming
    const dayMs = 24 * 60 * 60 * 1000
    const base  = new Date()

    const iv1 = new Date(base.getTime() + dayMs);     iv1.setUTCHours(10, 0, 0, 0)
    const iv2 = new Date(base.getTime() + 2 * dayMs); iv2.setUTCHours(14, 0, 0, 0)
    const iv3 = new Date(base.getTime() + 3 * dayMs); iv3.setUTCHours(11, 0, 0, 0)
    const iv4 = new Date(base.getTime() + 4 * dayMs); iv4.setUTCHours(15, 30, 0, 0)

    await prisma.interview.createMany({
      data: [
        { candidateId: c4.id, jobId: job1.id, userId, scheduledAt: iv1, duration: 60, type: 'VIDEO',   meetLink: 'https://meet.google.com/abc-1', status: 'SCHEDULED' },
        { candidateId: c8.id, jobId: job2.id, userId, scheduledAt: iv2, duration: 90, type: 'ONSITE',  meetLink: 'https://meet.google.com/abc-2', status: 'SCHEDULED' },
        { candidateId: c3.id, jobId: job1.id, userId, scheduledAt: iv3, duration: 30, type: 'PHONE',   meetLink: 'https://meet.google.com/abc-3', status: 'SCHEDULED' },
        { candidateId: c7.id, jobId: job2.id, userId, scheduledAt: iv4, duration: 60, type: 'VIDEO',   meetLink: 'https://meet.google.com/abc-4', status: 'SCHEDULED' },
      ],
    })

    console.log(`Demo workspace seeded for user ${userId}`)
  } catch (err) {
    console.error('seedForUser failed:', err)
  }
}

export async function runSeedIfEmpty(): Promise<void> {
  const userCount = await prisma.user.count()
  if (userCount > 0) return

  console.log('Empty database detected — seeding demo data...')
  try {
    const user = await seedDemoUser()
    await seedJobs(user.id)
    await seedCandidates(user.id)
    await seedPipeline()
    console.log(`Demo data seeded. Login: ${DEMO_EMAIL} / demo123`)
  } catch (err) {
    console.error('Seed failed:', err)
  }
}
