using ContentService.API.Models;
using ContentService.Application.DTOs;
using ContentService.Application.Interfaces;
using ContentService.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ContentService.API.Controllers;

/// <summary>
/// Manages contact form submissions
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IContactSubmissionRepository _contactSubmissionRepository;
    private readonly ILogger<ContactController> _logger;

    public ContactController(IContactSubmissionRepository contactSubmissionRepository, ILogger<ContactController> logger)
    {
        _contactSubmissionRepository = contactSubmissionRepository;
        _logger = logger;
    }

    /// <summary>
    /// Submit a contact form (Public)
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ContactSubmissionDto>>> SubmitContact([FromBody] CreateContactSubmissionRequest request, CancellationToken cancellationToken)
    {
        var submission = new ContactSubmission
        {
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            InquiryType = request.InquiryType,
            Message = request.Message,
            Status = "New"
        };

        await _contactSubmissionRepository.AddAsync(submission, cancellationToken);
        await _contactSubmissionRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Received contact submission from: {Email}", submission.Email);

        return Ok(ApiResponse<ContactSubmissionDto>.Ok(new ContactSubmissionDto
        {
            Id = submission.Id,
            Name = submission.Name,
            Email = submission.Email,
            Phone = submission.Phone,
            InquiryType = submission.InquiryType,
            Message = submission.Message,
            Status = submission.Status,
            CreatedAt = submission.CreatedAt
        }, "Your message has been submitted successfully. We will get back to you soon!"));
    }

    /// <summary>
    /// Get all contact submissions (Admin only)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedApiResponse<ContactSubmissionDto>>> GetSubmissions(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null,
        CancellationToken cancellationToken = default)
    {
        var (submissions, total) = await _contactSubmissionRepository.GetPagedAsync(page, pageSize, status, cancellationToken);
        var dtos = submissions.Select(s => new ContactSubmissionDto
        {
            Id = s.Id,
            Name = s.Name,
            Email = s.Email,
            Phone = s.Phone,
            InquiryType = s.InquiryType,
            Message = s.Message,
            Status = s.Status,
            AdminNotes = s.AdminNotes,
            CreatedAt = s.CreatedAt,
            UpdatedAt = s.UpdatedAt
        });
        return Ok(PagedApiResponse<ContactSubmissionDto>.Ok(dtos, page, pageSize, total));
    }

    /// <summary>
    /// Get contact submission by ID (Admin only)
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ContactSubmissionDto>>> GetSubmission(Guid id, CancellationToken cancellationToken)
    {
        var submission = await _contactSubmissionRepository.GetByIdAsync(id, cancellationToken);
        if (submission == null)
            return NotFound(ApiResponse<ContactSubmissionDto>.Fail("Submission not found"));

        return Ok(ApiResponse<ContactSubmissionDto>.Ok(new ContactSubmissionDto
        {
            Id = submission.Id,
            Name = submission.Name,
            Email = submission.Email,
            Phone = submission.Phone,
            InquiryType = submission.InquiryType,
            Message = submission.Message,
            Status = submission.Status,
            AdminNotes = submission.AdminNotes,
            CreatedAt = submission.CreatedAt,
            UpdatedAt = submission.UpdatedAt
        }));
    }

    /// <summary>
    /// Update submission status (Admin only)
    /// </summary>
    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<ApiResponse<ContactSubmissionDto>>> UpdateStatus(Guid id, [FromBody] UpdateContactStatusRequest request, CancellationToken cancellationToken)
    {
        var submission = await _contactSubmissionRepository.GetByIdAsync(id, cancellationToken);
        if (submission == null)
            return NotFound(ApiResponse<ContactSubmissionDto>.Fail("Submission not found"));

        submission.Status = request.Status;
        submission.AdminNotes = request.AdminNotes;
        submission.UpdatedAt = DateTime.UtcNow;

        await _contactSubmissionRepository.UpdateAsync(submission, cancellationToken);
        await _contactSubmissionRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated contact submission status: {SubmissionId} to {Status}", id, request.Status);

        return Ok(ApiResponse<ContactSubmissionDto>.Ok(new ContactSubmissionDto
        {
            Id = submission.Id,
            Name = submission.Name,
            Email = submission.Email,
            Phone = submission.Phone,
            InquiryType = submission.InquiryType,
            Message = submission.Message,
            Status = submission.Status,
            AdminNotes = submission.AdminNotes,
            CreatedAt = submission.CreatedAt,
            UpdatedAt = submission.UpdatedAt
        }, "Status updated successfully"));
    }

    /// <summary>
    /// Delete a submission (Admin only)
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteSubmission(Guid id, CancellationToken cancellationToken)
    {
        var submission = await _contactSubmissionRepository.GetByIdAsync(id, cancellationToken);
        if (submission == null)
            return NotFound(ApiResponse<bool>.Fail("Submission not found"));

        await _contactSubmissionRepository.DeleteAsync(submission, cancellationToken);
        await _contactSubmissionRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted contact submission: {SubmissionId}", id);

        return Ok(ApiResponse<bool>.Ok(true, "Submission deleted successfully"));
    }
}
