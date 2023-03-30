using System.Threading;
using System.Threading.Tasks;
using System.Transactions;
using MediatR;

namespace LaHistoricalMarkers.Core.Behaviors;

public class TransactionScopePipelineBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        using var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
        var response = await next();
        transactionScope.Complete();
        return response;
    }
}