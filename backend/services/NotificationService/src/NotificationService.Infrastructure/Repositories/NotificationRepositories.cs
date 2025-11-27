using Microsoft.EntityFrameworkCore;
using NotificationService.Application.Interfaces;
using NotificationService.Domain.Entities;
using NotificationService.Infrastructure.Persistence;

namespace NotificationService.Infrastructure.Repositories;

public class PushSubscriptionRepository : IPushSubscriptionRepository
{
    private readonly NotificationDbContext _context;

    public PushSubscriptionRepository(NotificationDbContext context)
    {
        _context = context;
    }

    public async Task<PushSubscription?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.PushSubscriptions
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<PushSubscription?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.PushSubscriptions
            .FirstOrDefaultAsync(x => x.UserId == userId && x.IsActive, cancellationToken);
    }

    public async Task<IEnumerable<PushSubscription>> GetActiveSubscriptionsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.PushSubscriptions
            .Where(x => x.IsActive)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<PushSubscription>> GetByUserIdsAsync(IEnumerable<Guid> userIds, CancellationToken cancellationToken = default)
    {
        return await _context.PushSubscriptions
            .Where(x => userIds.Contains(x.UserId) && x.IsActive)
            .ToListAsync(cancellationToken);
    }

    public async Task<PushSubscription> AddAsync(PushSubscription subscription, CancellationToken cancellationToken = default)
    {
        await _context.PushSubscriptions.AddAsync(subscription, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return subscription;
    }

    public async Task UpdateAsync(PushSubscription subscription, CancellationToken cancellationToken = default)
    {
        subscription.UpdatedAt = DateTime.UtcNow;
        _context.PushSubscriptions.Update(subscription);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var subscription = await GetByIdAsync(id, cancellationToken);
        if (subscription != null)
        {
            _context.PushSubscriptions.Remove(subscription);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}

public class NotificationRepository : INotificationRepository
{
    private readonly NotificationDbContext _context;

    public NotificationRepository(NotificationDbContext context)
    {
        _context = context;
    }

    public async Task<Notification?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Notifications
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Notification>> GetByUserIdAsync(Guid userId, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        return await _context.Notifications
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Notification>> GetUnreadByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Notifications
            .Where(x => x.UserId == userId && x.ReadAt == null)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Notification> AddAsync(Notification notification, CancellationToken cancellationToken = default)
    {
        await _context.Notifications.AddAsync(notification, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return notification;
    }

    public async Task UpdateAsync(Notification notification, CancellationToken cancellationToken = default)
    {
        notification.UpdatedAt = DateTime.UtcNow;
        _context.Notifications.Update(notification);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Notifications
            .CountAsync(x => x.UserId == userId && x.ReadAt == null, cancellationToken);
    }
}
