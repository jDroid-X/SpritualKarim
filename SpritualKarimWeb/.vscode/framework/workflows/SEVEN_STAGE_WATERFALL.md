# Seven-Stage Waterfall Workflow

Governance document derived from GEMINI.md adapted for web development.
All projects MUST follow this sequence with mandatory gate checks.

---

## Stage 1: INITIATE

**Owner**: Product Owner / Initiator Agent
**Duration**: 1-2 days

### Activities
1. Define project scope and objectives
2. Identify stakeholders and roles
3. Select appropriate agent roles from AGENT_ROLES.md
4. Create project brief document

### Exit Criteria
- [ ] Project brief written and approved
- [ ] Agent roster defined
- [ ] Success metrics identified
- [ ] Risk assessment completed

### Gate Check
Before proceeding: Does the project brief answer Who, What, Why, When•

---

## Stage 2: REQUIREMENTS

**Owner**: Business Analyst / Initiator Agent
**Duration**: 3-5 days

### Activities
1. Gather functional requirements (user stories)
2. Gather non-functional requirements (performance, security)
3. Define acceptance criteria for each story
4. Create requirement traceability matrix

### Exit Criteria
- [ ] All user stories written with acceptance criteria
- [ ] Non-functional requirements documented
- [ ] Priority ranking completed
- [ ] Stakeholder sign-off obtained

### Gate Check
Before proceeding: Can a developer implement from these stories alone•

---

## Stage 3: DESIGN

**Owner**: Architect Agent
**Duration**: 3-5 days

### Activities
1. Create system architecture diagram
2. Define data models and relationships
3. Design API contracts
4. Plan UI/UX wireframes
5. Define security controls and RBAC matrix

### Exit Criteria
- [ ] Architecture diagram approved
- [ ] Database schema documented
- [ ] API specifications written
- [ ] Security model defined (RBAC levels)
- [ ] Design review completed

### Gate Check
Before proceeding: Does the design satisfy all requirements from Stage 2•

---

## Stage 4: IMPLEMENT

**Owner**: Frontend-Dev + Backend-Dev Agents
**Duration**: 2-4 weeks

### Activities
1. Set up project structure from framework template
2. Implement Model layer (data, validation, business rules)
3. Implement View layer (DOM rendering, UI state)
4. Implement Controller layer (event dispatch, routing)
5. Integrate with config (appConfig.js)
6. Write unit tests for each module

### Exit Criteria
- [ ] All user stories implemented
- [ ] Unit tests passing (>80% coverage)
- [ ] Code review completed
- [ ] No hardcoded values (all in appConfig.js)
- [ ] MVC boundaries respected

### Gate Check
Before proceeding: Do all tests pass• Is code reviewed•

---

## Stage 5: TEST

**Owner**: QA-Engineer Agent
**Duration**: 1-2 weeks

### Activities
1. Generate RAG report with minimum 20 test scenarios
2. Run cross-portal validation (all 7 roles)
3. Perform security audit (XSS, CSRF, RBAC bypass)
4. Test responsive behavior across breakpoints
5. Validate localStorage dual-write strategy
6. Test power-loss detection mechanism

### Exit Criteria
- [ ] All RAG scenarios marked Pass or Fail with reason
- [ ] Security scan passed
- [ ] Cross-browser testing completed
- [ ] Performance benchmarks met
- [ ] No critical bugs open

### Gate Check
Before proceeding: Are all critical and high bugs resolved•

---

## Stage 6: DEPLOY

**Owner**: DevOps Agent
**Duration**: 1-3 days

### Activities
1. Configure CI/CD pipeline
2. Set up environment variables (.env)
3. Deploy to staging environment
4. Run smoke tests on staging
5. Prepare rollback plan
6. Deploy to production

### Exit Criteria
- [ ] CI/CD pipeline green
- [ ] Staging smoke tests passed
- [ ] Production deployed successfully
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured

### Gate Check
Before proceeding: Is the rollback plan tested and ready•

---

## Stage 7: MAINTAIN

**Owner**: Ops Team + All Agents (as needed)
**Duration**: Ongoing

### Activities
1. Monitor application health
2. Process user feedback
3. Address bug reports
4. Plan iterative improvements
5. Update documentation
6. Review and refine agent workflows

### Exit Criteria
- [ ] SLA targets met
- [ ] Feedback loop active
- [ ] Documentation up to date
- [ ] Next iteration planned

### Gate Check
Before proceeding: Is the feedback loop capturing actionable insights•

---

## Closed-Loop Feedback Rules

From WORKFLOW_AGENT_OPERATING_RULES.txt:

1. Every stage produces output that becomes input to next stage
2. No stage proceeds without gate check approval
3. Failures at any stage trigger return to previous stage
4. All decisions logged with rationale
5. Human review required at each gate check

## Branch Convergence Rules

1. All conditional logic must have else/default branch
2. All async operations must have error handler
3. All user actions must have confirmation/cancellation path
4. No state can exist without a cleanup path

---

*Adapted from GEMINI.md Stage Governance → Web Development Workflow*
