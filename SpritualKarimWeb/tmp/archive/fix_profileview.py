import re

file_path = r'c:\Users\jiten\jAnitGravity\SpritualKarim\SpritualKarimWeb\js\views\ProfileView.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the method start
method_start = content.find('  _renderHouseCleanCards(levels) {')
if method_start == -1:
    print('ERROR: Method not found')
    exit()

# Find the method end (next method after)
method_end_marker = '  _renderInterestedSadhanas(sadhanas) {'
method_end = content.find(method_end_marker, method_start)
if method_end == -1:
    print('ERROR: End marker not found')
    exit()

# Extract old method
old_method = content[method_start:method_end]
print(f'Found method at position {method_start}')
print(f'Method length: {len(old_method)}')

# Create new method
new_method = '''  _renderHouseCleanCards(levels) {
    const html = levels
      .map(
        (lvl, i) => `
      <div class="houseclean-level-section" data-level="${lvl.levelNumber || i + 1}">
        <div class="houseclean-level-header">
          <span class="level-badge">Level ${lvl.levelNumber || i + 1}</span>
          <span class="level-title">${lvl.levelTitle || `Level ${lvl.levelNumber || i + 1} House Clean`}</span>
          <button type="button" class="btn btn-sm btn-outline btn-upload-level" data-level="${lvl.levelNumber || i + 1}" title="Upload House Clean Document">
            <span>📤</span> Upload Document
          </button>
        </div>
        <div class="houseclean-level-content">
          <div class="form-grid-3">
            <div class="form-group">
              <label class="form-label">Clean Status</label>
              <select class="form-control hc-status-select">
                <option value="NOT_STARTED" ${lvl.status === "NOT_STARTED" ? "selected" : ""}>Not Started</option>
                <option value="IN_PROGRESS" ${lvl.status === "IN_PROGRESS" ? "selected" : ""}>In Progress</option>
                <option value="PENDING_APPROVAL" ${lvl.status === "PENDING_APPROVAL" ? "selected" : ""}>Pending Mentor Approval</option>
                <option value="APPROVED" ${lvl.status === "APPROVED" ? "selected" : ""}>Approved & Certified</option>
                <option value="REVISION_NEEDED" ${lvl.status === "REVISION_NEEDED" ? "selected" : ""}>Needs Improvement</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Verified % Clean (0-100)</label>
              <input type="number" class="form-control hc-percentage-input" min="0" max="100" value="${lvl.cleanPercentage || 0}">
            </div>
            <div class="form-group">
              <label class="form-label">Approval Date / Timestamp</label>
              <input type="text" class="form-control hc-date-input" placeholder="e.g. 2025-02-15" value="${lvl.approvalDate || ''}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Cleansing Details & Purified Areas</label>
            <textarea class="form-control hc-details-textarea" rows="2" placeholder="Describe altar purification, salt water wash, loban...">${lvl.cleanedDetails || ''}</textarea>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Approved By Mentor Code & Name</label>
              <input type="text" class="form-control hc-mentor-input" placeholder="Mentor Name & Code" value="${lvl.mentorName ? `${lvl.mentorName} (${lvl.mentorCode || ''})` : ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Mentor Remarks & Seal</label>
              <input type="text" class="form-control hc-remarks-input" placeholder="Remarks" value="${lvl.mentorRemarks || ''}">
            </div>
          </div>
        </div>
      </div>
    `,
      )
      .join("");

    if (this.devoteeHouseCleanContainer)
      this.devoteeHouseCleanContainer.innerHTML = html;
    if (this.seekerHouseCleanSummaryContainer)
      this.seekerHouseCleanSummaryContainer.innerHTML = html;
  }

'''

# Replace
new_content = content[:method_start] + new_method + content[method_end:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('SUCCESS: Method replaced')
print(f'New file size: {len(new_content)} bytes')
