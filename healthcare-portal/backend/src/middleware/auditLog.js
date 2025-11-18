const AuditLog = require('../models/AuditLog');

exports.logAction = (action, resourceType = null) => {
  return async (req, res, next) => {
    try {
      if (req.user) {
        await AuditLog.create({
          userId: req.user._id,
          action,
          resourceType,
          resourceId: req.params.id || null,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          details: {
            method: req.method,
            path: req.path
          }
        });
      }
    } catch (error) {
      console.error('Audit log error:', error);
    }
    next();
  };
};