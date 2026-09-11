/**
 * Backend/services/SyncService.js
 * Bi-directional Cloud and Offline Queue Synchronization Service
 * Shree Spritual Karim Sansthan
 */

class SyncService {
  constructor(options = {}) {
    this.offlineQueue = [];
    this.syncIntervalMs = options.syncIntervalMs || 30000;
    this.isOnline = true;
  }

  enqueueChange(operation, payload) {
    const queueItem = {
      id: 'sync_' + Math.random().toString(36).substr(2, 9),
      operation,
      payload,
      timestamp: Date.now(),
      status: 'PENDING'
    };
    this.offlineQueue.push(queueItem);
    return queueItem;
  }

  getQueue() {
    return [...this.offlineQueue];
  }

  async flushQueue(syncHandler) {
    if (this.offlineQueue.length === 0) return { flushed: 0, pending: 0 };

    const itemsToProcess = [...this.offlineQueue];
    let flushedCount = 0;

    for (const item of itemsToProcess) {
      try {
        if (typeof syncHandler === 'function') {
          await syncHandler(item);
        }
        flushedCount++;
      } catch (err) {
        console.error(`Sync error on item ${item.id}:`, err);
      }
    }

    this.offlineQueue = this.offlineQueue.slice(flushedCount);
    return { flushed: flushedCount, pending: this.offlineQueue.length };
  }
}

module.exports = SyncService;
