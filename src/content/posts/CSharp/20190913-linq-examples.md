---
title: LINQ Examples
tags: LINQ "Entity Framework"
---

### GroupBy
Returns an `IQueryable<IGrouping<int,object>>` where the `IGrouping` is keyed by the group by value

```cs
foreach (IGrouping<int, MemberContactDetail> grouping in detailsToProcess.GroupBy(mcd => mcd.PCDID))
{
    foreach (MemberContactDetail mcd in grouping)
    {
        if (!StatusNotToProcess.Contains(mcd.MKNotifiedStatusID))
        {
            Console.WriteLine(mcd);
        }
    }
}
```


### SubQueries

```cs
List<int> IdsToFind = new List<int>() {2, 3, 4};

db.Users
.Where(u => SqlMethods.Like(u.LastName, "%fra%"))
.Where(u =>
    db.CompanyRolesToUsers
    .Where(crtu => IdsToFind.Contains(crtu.CompanyRoleId))
    .Select(crtu =>  crtu.UserId)
    .Contains(u.Id)
)
```
