## Assignment Checklist
### E
1. ~~Implement K-means Clustering with Pearson similarity~~
2. ~~Run the algorithm on the blog data dataset with 5 clusters~~
3. ~~The iteration shall stop after a specified number of iterations~~
4. ~~Present the result as a list of clusters and their assignments~~
5. Implement the system using a REST web service where:
    1. ~~client sends a request to a server~~
    2. ~~the server responds with json data~~
    3. ~~the json data is decoded and presented in a client GUI~~
### C-D
1. ~~Instead of stopping after a specified number of iterations, you shall implement functionality for stopping when no new assignments are made~~
2. ~~Each cluster must keep track of the previous assignment, and a check is made if the new cluster assignment matches the previous one~~
### A-B
1. ~~Implement Hierarchical Clustering with Pearson similarity~~
2. ~~Run the algorithm on the blog data dataset~~
3. ~~Present the result as an interactive tree in the client GUI (it shall be possible to expand/collapse branches)~~
### GUI Appearance & Execution Examples
> Note: While I am no designer by any means, this GUI could have been made prettier with more time. You said that appearance does not matter, and this fulfils all functional requirements so I deem it as "good enough", but no more than that.

#### Hierarchical Clustering
![Hierarchical Clustering1](https://i.gyazo.com/3bd6242ab85e0803823328bafb94f38f.png)
![Hierarchical Clustering2](https://i.gyazo.com/095bc0d73efd77ec4a0baea935303382.png)

#### K-Means Clustering (fixed iters: 20)
![K-Means Clustering (fixed iters: 20)](https://i.gyazo.com/79cbf412db106059a09302aac366b7f9.png)

### K-Means Clustering (smart iters: "go until finished")
![K-Means Clustering (smart iters: "go until finished")](https://i.gyazo.com/d77609f06ed2bf482f926a9b817e8f73.png)