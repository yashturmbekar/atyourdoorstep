using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderService.Application.DTOs;
using OrderService.Application.Interfaces;
using Shared.Application.DTOs;

namespace OrderService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CustomersController : ControllerBase
{
    private readonly ICustomerRepository _customerRepository;

    public CustomersController(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    /// <summary>
    /// Get all customers with pagination (Admin/Manager only)
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<CustomerResponseDto>>>> GetCustomers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var (customers, total) = await _customerRepository.GetPagedAsync(page, pageSize, null, cancellationToken);

        var items = customers.Select(c => new CustomerResponseDto
        {
            Id = c.Id,
            FirstName = c.FirstName,
            LastName = c.LastName,
            Email = c.Email,
            PhoneNumber = c.PhoneNumber,
            Address = c.Address,
            City = c.City,
            State = c.State,
            PostalCode = c.PostalCode,
            Country = c.Country,
            UserId = c.UserId,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        }).ToList();

        var paginatedResponse = new PaginatedResponse<CustomerResponseDto>
        {
            Data = items,
            Meta = new PaginationMeta
            {
                Page = page,
                PageSize = pageSize,
                Total = total,
                TotalPages = (int)Math.Ceiling(total / (double)pageSize)
            }
        };

        return Ok(ApiResponse<PaginatedResponse<CustomerResponseDto>>.SuccessResponse(paginatedResponse));
    }

    /// <summary>
    /// Get customer by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<CustomerResponseDto>>> GetCustomer(Guid id, CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByIdAsync(id, cancellationToken);
        if (customer == null)
        {
            return NotFound(ApiResponse<CustomerResponseDto>.ErrorResponse("Customer not found"));
        }

        var response = new CustomerResponseDto
        {
            Id = customer.Id,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Email = customer.Email,
            PhoneNumber = customer.PhoneNumber,
            Address = customer.Address,
            City = customer.City,
            State = customer.State,
            PostalCode = customer.PostalCode,
            Country = customer.Country,
            UserId = customer.UserId,
            CreatedAt = customer.CreatedAt,
            UpdatedAt = customer.UpdatedAt
        };

        return Ok(ApiResponse<CustomerResponseDto>.SuccessResponse(response));
    }

    /// <summary>
    /// Create new customer
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CustomerResponseDto>>> CreateCustomer(
        [FromBody] CreateCustomerRequestDto request,
        CancellationToken cancellationToken = default)
    {
        // Check if email already exists
        var emailExists = await _customerRepository.EmailExistsAsync(request.Email, cancellationToken);
        if (emailExists)
        {
            return BadRequest(ApiResponse<CustomerResponseDto>.ErrorResponse("Customer with this email already exists"));
        }

        var customer = new Domain.Entities.Customer
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            Address = request.Address,
            City = request.City,
            State = request.State,
            PostalCode = request.PostalCode,
            Country = request.Country,
            UserId = request.UserId
        };

        await _customerRepository.AddAsync(customer, cancellationToken);

        var response = new CustomerResponseDto
        {
            Id = customer.Id,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Email = customer.Email,
            PhoneNumber = customer.PhoneNumber,
            Address = customer.Address,
            City = customer.City,
            State = customer.State,
            PostalCode = customer.PostalCode,
            Country = customer.Country,
            UserId = customer.UserId,
            CreatedAt = customer.CreatedAt,
            UpdatedAt = customer.UpdatedAt
        };

        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id },
            ApiResponse<CustomerResponseDto>.SuccessResponse(response, "Customer created successfully"));
    }

    /// <summary>
    /// Update customer
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<CustomerResponseDto>>> UpdateCustomer(
        Guid id,
        [FromBody] UpdateCustomerRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByIdAsync(id, cancellationToken);
        if (customer == null)
        {
            return NotFound(ApiResponse<CustomerResponseDto>.ErrorResponse("Customer not found"));
        }

        // Update only provided fields
        if (!string.IsNullOrEmpty(request.FirstName)) customer.FirstName = request.FirstName;
        if (!string.IsNullOrEmpty(request.LastName)) customer.LastName = request.LastName;
        if (!string.IsNullOrEmpty(request.Email)) customer.Email = request.Email;
        if (request.PhoneNumber != null) customer.PhoneNumber = request.PhoneNumber;
        if (request.Address != null) customer.Address = request.Address;
        if (request.City != null) customer.City = request.City;
        if (request.State != null) customer.State = request.State;
        if (request.PostalCode != null) customer.PostalCode = request.PostalCode;
        if (request.Country != null) customer.Country = request.Country;

        await _customerRepository.UpdateAsync(customer, cancellationToken);

        var response = new CustomerResponseDto
        {
            Id = customer.Id,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Email = customer.Email,
            PhoneNumber = customer.PhoneNumber,
            Address = customer.Address,
            City = customer.City,
            State = customer.State,
            PostalCode = customer.PostalCode,
            Country = customer.Country,
            UserId = customer.UserId,
            CreatedAt = customer.CreatedAt,
            UpdatedAt = customer.UpdatedAt
        };

        return Ok(ApiResponse<CustomerResponseDto>.SuccessResponse(response, "Customer updated successfully"));
    }

    /// <summary>
    /// Delete customer (Admin only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteCustomer(Guid id, CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByIdAsync(id, cancellationToken);
        if (customer == null)
        {
            return NotFound(ApiResponse<object>.ErrorResponse("Customer not found"));
        }

        await _customerRepository.DeleteAsync(customer, cancellationToken);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "Customer deleted successfully"));
    }

    /// <summary>
    /// Get customer by user ID
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<ApiResponse<CustomerResponseDto>>> GetCustomerByUserId(Guid userId, CancellationToken cancellationToken = default)
    {
        var customer = await _customerRepository.GetByUserIdAsync(userId, cancellationToken);
        if (customer == null)
        {
            return NotFound(ApiResponse<CustomerResponseDto>.ErrorResponse("Customer not found for this user"));
        }

        var response = new CustomerResponseDto
        {
            Id = customer.Id,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Email = customer.Email,
            PhoneNumber = customer.PhoneNumber,
            Address = customer.Address,
            City = customer.City,
            State = customer.State,
            PostalCode = customer.PostalCode,
            Country = customer.Country,
            UserId = customer.UserId,
            CreatedAt = customer.CreatedAt,
            UpdatedAt = customer.UpdatedAt
        };

        return Ok(ApiResponse<CustomerResponseDto>.SuccessResponse(response));
    }
}
