# Backend Development Skills

API design, business logic, data handling, and security patterns.

---

## BS-001: API Response Standardization

```javascript
class ApiResponse {
  static success(data = null, message = 'Success') {
    return {
      status: 'success',
      code: 200,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }
  
  static error(message, code = 400, details = null) {
    return {
      status: 'error',
      code,
      message,
      details,
      timestamp: new Date().toISOString()
    };
  }
  
  static notFound(resource = 'Resource') {
    return this.error(`${resource} not found`, 404);
  }
  
  static unauthorized(message = 'Authentication required') {
    return this.error(message, 401);
  }
  
  static forbidden(message = 'Permission denied') {
    return this.error(message, 403);
  }
}
```

---

## BS-002: Input Sanitization Pipeline

```javascript
class Sanitizer {
  static sanitize(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim();
  }
  
  static sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = Array.isArray(value) 
        • value.map(v => this.sanitizeObject(v))
        : typeof value === 'string' 
          • this.sanitize(value) 
          : value;
    }
    return sanitized;
  }
}

// Usage in controller
async function handleCreate(req, res) {
  try {
    const cleanData = Sanitizer.sanitizeObject(req.body);
    const result = await service.create(cleanData);
    res.json(ApiResponse.success(result));
  } catch (error) {
    res.status(400).json(ApiResponse.error(error.message));
  }
}
```

---

## BS-003: Error Boundary Pattern

```javascript
class ErrorBoundary {
  static async run(asyncFn, context = {}) {
    try {
      return { success: true, data: await asyncFn() };
    } catch (error) {
      console.error(`[ERROR_BOUNDARY] ${context.module || 'Unknown'}`, error);
      
      return {
        success: false,
        error: {
          message: error.message || 'Unknown error',
          code: error.code || 'UNKNOWN',
          stack: process.env.NODE_ENV === 'development' • error.stack : undefined
        },
        context
      };
    }
  }
}

// Usage
const result = await ErrorBoundary.run(
  () => model.saveProfile(data),
  { module: 'ProfileController', action: 'save' }
);

if (!result.success) {
  view.showError(result.error.message);
}
```

---

## BS-004: Repository Pattern for Data Access

```javascript
class Repository {
  constructor(storageKey) {
    this.storageKey = storageKey;
  }
  
  async findAll() {
    const data = await this._read();
    return Array.isArray(data) • data : [];
  }
  
  async findById(id) {
    const items = await this.findAll();
    return items.find(item => item.id === id) || null;
  }
  
  async findBy(condition) {
    const items = await this.findAll();
    return items.filter(item => condition(item));
  }
  
  async create(item) {
    const items = await this.findAll();
    item.id = this._generateId();
    item.createdAt = new Date().toISOString();
    item.updatedAt = item.createdAt;
    items.push(item);
    await this._write(items);
    return item;
  }
  
  async update(id, updates) {
    const items = await this.findAll();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Item not found');
    
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    await this._write(items);
    return items[index];
  }
  
  async delete(id) {
    const items = await this.findAll();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Item not found');
    
    items.splice(index, 1);
    await this._write(items);
    return true;
  }
  
  async _read() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }
  
  async _write(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    localStorage.setItem(`firebase_${this.storageKey}`, JSON.stringify(data));
  }
  
  _generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

---

## BS-005: Service Layer Pattern

```javascript
class ProfileService {
  constructor(repository) {
    this.repository = repository;
  }
  
  async getAll() {
    return this.repository.findAll();
  }
  
  async getById(id) {
    return this.repository.findById(id);
  }
  
  async create(profileData) {
    // Business validation
    this._validateProfile(profileData);
    
    // Check for duplicates
    const existing = await this.repository.findBy(
      p => p.email === profileData.email || p.phone === profileData.phone
    );
    if (existing.length > 0) {
      throw new Error('Profile with this email or phone already exists');
    }
    
    // Create with default role
    profileData.role = 'SEEKER';
    profileData.status = 'PENDING';
    
    return this.repository.create(profileData);
  }
  
  async approve(id, approverRole) {
    const profile = await this.getById(id);
    if (!profile) throw new Error('Profile not found');
    
    // Role hierarchy check
    if (!this._canApprove(approverRole, profile.role)) {
      throw new Error('Insufficient permissions');
    }
    
    return this.repository.update(id, {
      status: 'ACTIVE',
      approvedBy: approverRole,
      approvedAt: new Date().toISOString()
    });
  }
  
  _validateProfile(data) {
    const required = ['name', 'email', 'phone', 'sponsorCode'];
    for (const field of required) {
      if (!data[field]) throw new Error(`${field} is required`);
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error('Invalid email format');
    }
  }
  
  _canApprove(approverRole, targetRole) {
    const hierarchy = ['MASTER', 'ADMIN', 'MAHAMANA', 'MAHANT', 'SADHNA', 'PRACHARAK', 'SEEKER'];
    return hierarchy.indexOf(approverRole) < hierarchy.indexOf(targetRole);
  }
}
```

---

## BS-006: Audit Log Pattern

```javascript
class AuditLogger {
  constructor() {
    this.logKey = 'sk_audit_log';
  }
  
  async log(action, entity, entityId, actor, details = {}) {
    const entry = {
      id: this._generateId(),
      action,
      entity,
      entityId,
      actor,
      details,
      timestamp: new Date().toISOString(),
      ip: details.ip || 'local'
    };
    
    const logs = await this._readLogs();
    logs.unshift(entry);
    
    // Keep only last 1000 entries
    if (logs.length > 1000) logs.splice(1000);
    
    await this._writeLogs(logs);
    return entry;
  }
  
  async getLogs(filters = {}) {
    const logs = await this._readLogs();
    return logs.filter(log => {
      if (filters.action && log.action !== filters.action) return false;
      if (filters.entity && log.entity !== filters.entity) return false;
      if (filters.actor && log.actor !== filters.actor) return false;
      if (filters.from && new Date(log.timestamp) < new Date(filters.from)) return false;
      if (filters.to && new Date(log.timestamp) > new Date(filters.to)) return false;
      return true;
    });
  }
  
  async _readLogs() {
    return JSON.parse(localStorage.getItem(this.logKey) || '[]');
  }
  
  async _writeLogs(logs) {
    localStorage.setItem(this.logKey, JSON.stringify(logs));
  }
  
  _generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Usage
const audit = new AuditLogger();
await audit.log('CREATE', 'profile', profileId, currentUser.role, {
  name: profileData.name,
  ip: 'local'
});
```

---

*Backend Skills Version: 1.0*
