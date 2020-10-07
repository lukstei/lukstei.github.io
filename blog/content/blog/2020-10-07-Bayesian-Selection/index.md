# Mean/Variance portfolio selection with R

Markowitz introduced the Mean-Variance framework (also called Modern
Portfolio Theory) in his original article [1]. He introduced the process of
selecting an optimal portfolio for an investor by dividing it into two
stages. 

The first stage is concerned about the future performance of the
available financial assets and results in a set of quantified
characteristics about this assets. 

The second stage is concerned about
building an optimized portfolio, this is accomplished by taking the
quantified characteristics of the financial assets in the first stage
and optimizing the portfolio according to some goal function such as the
investors expected utility. 

Markowitz concentrates only on two of these
quantified characteristics of financial assets, namely the expected
value and variance of the portfolio (hence the name Mean/Variance
framework) and argues that the investor desires expected return and does
not desire variance (i.e. uncertainty). 

One could argue the best way to
build a portfolio is by maximizing only the expected (discounted) return
and ignoring the variance, but Markowitz rejects this hypothesis and
argues that this would never imply that there is a diversified portfolio
which is preferable over a expected value optimized portfolio, but
diversification is both observed and sensible, and therefore does not
imply the superiority of diversification and thus must be rejected.

#### Problem formulation

**Asset return** We have a risky financial asset, e.g. a stock share,
index or a bond, which has a market price  $p_t$ at time $t$, for which the financial asset can be bought or sold. We define the (simple/discrete) return for period $t-1$ to $t$ of the asset as the relative change of the price subtracted by 1:

$$
r_t = \frac{p_{t}}{p_{t-1}} - 1
$$


**The portfolio** We have an investable universe of $j = 1..S$ risky financial assets, and an investor chooses a portfolio at time $t$, i.e. allocates his wealth among the $S$ assets, based on the expectations on the unknown and therefore random returns $\boldsymbol{\mathbf{R_{t+1}}} \in \mathbb{R}^S$ for period $t$ to $t+1$. Usually the investors portfolio is expressed in terms of the portfolio weight vector $w \in \mathbb{R}^S$, where $w_j$ is the fraction of the total capital invested in asset $j$ in period $t$ to $t+1$.

**Means and the covariance matrix of returns** As said, in the Mean/Variance framework for choosing a portfolio the investor only takes into account the means $\mu \in \mathbb{R}^S$ of the returns and covariances $\Sigma \in \mathbb{R}^S \times \mathbb{R}^S$ between the returns: 
$$
\mu = \mathbb{E} (\boldsymbol{\mathbf{R_{t+1}}})\\
\Sigma = \text{Cov} (\boldsymbol{\mathbf{R_{t+1}}})
$$
The real $\mu$ and $\Sigma$ are typically unknown. 
One common method to estimate $\mu$ and $\Sigma$ is to use historical return data up to time $t$ and to calculate the maximum likelihood estimations of  $\mu$ and $\Sigma$ based on the historical returns from some period $t-t_{start}$ to $t$. This period $t-t_{start}$ to $t$ is also called the look-back period.

**Means and variance of the portfolio** After obtaining $\mu$ and $\Sigma$, or a proxy thereof, we can calculate the expected return $\mu_P$ and variance of the portfolio $\sigma_P^2$ in terms of the means and the covariance matrix of returns.
$$
\mu_P = w^T \mu\\
\sigma_P^2 = w^T \Sigma w
$$

**Markowitz efficient portfolio** A portfolio $w$ is efficient when it has the lowest variance among all obtainable portfolios for a given $\mu_{\text{target}}$, where $\mu_{\text{target}}$ is the pre-chosen target expected portfolio return (Minimum variance formulation). One additional constraint is that the portfolio must be fully invested, i.e. the portfolio weights must sum to one:
$$
w_{eff} = \argmin_{w} \frac{1}{2} \sigma_P^2\\
= \argmin_{w} \frac{1}{2} w^T \Sigma w\\
\text{s.t. }w^T \mu = \mu_{\text{target}}\\
1^T w = 1
$$

Deriving the analytical solutions for the efficient portfolio problem is straightforward using the method of Lagrange multipliers.

```R
solve.min_var = function(target.mu, mus, cov) {
  ones = rep(1, length(mus))
  cov.inv = solve(cov)
  a = t(ones) %*% cov.inv %*% ones
  b = t(ones) %*% cov.inv %*% mus
  c = t(mus) %*% cov.inv %*% mus
  
  delta = a * c - b^2
  l1 = (c - b * target.mu) / delta
  l2 = (a*target.mu - b) / delta
  
  cov.inv %*% (as.numeric(l1) * ones + as.numeric(l2) * mus)
}

```


Analogue to the efficient portfolio, one can obtain the global minimum variance portfolio $w_{gmv}$, which is the portfolio with the least variance among all obtainable portfolio. The optimization formulation is equivalent to the efficient portfolio formulation, but without the target return constraint. The solution for $w_{gmv}$ is:
$$
w_{gmv} = \frac{\Sigma^{-1} \mathbb{1}}{\mathbb{1}^T \Sigma^{-1} 1}
$$

```R
solve.gmv = function(mus, cov) {
  ones = rep(1, length(mus))
  (solve(cov) %*% ones) / as.numeric(t(ones) %*% solve(cov) %*% ones)
}
```

## An example

We have a hypothetical investable universe of three risky financial assets consisting of two stocks and one bond. We assume the two stocks have yearly expected returns $\mu_1 = 11\%, \mu_2 = 10\%$ and yearly expected volatility of $\sigma_1 = 23\%, \sigma_2 = 22\%$ and a correlation of $\rho_{12} = 0.4$. The bond has a slightly lower yearly return and risk of $\mu_3 = 7\%$ and $\sigma_3 = 12\%$. We assume the bond has a negative correlation to the stocks: $\rho_{13} = -0.2, \rho_{23} = -0.1$.

We can construct the mean vector $\mu$ and covariance matrix $\Sigma$, using the standard deviations $\sigma$ and the correlations $\rho$:

> Given a vector $x \in \mathbb{R}^S$ the $\text{diag}(x)$ function returns a matrix $\in \mathbb{R}^{S \times S}$ with the components of $x$ on the diagonal

$$
\mu = \begin{pmatrix}
  \mu_1\\
  \mu_2\\
  \mu_3\\
 \end{pmatrix} = \begin{pmatrix}
  0.11\\
  0.1\\
  0.07\\
 \end{pmatrix}, \sigma = \begin{pmatrix}
  \sigma_1\\
  \sigma_2\\
  \sigma_3\\
 \end{pmatrix} = \begin{pmatrix}
  0.23\\
  0.22\\
  0.12\\
 \end{pmatrix}\\
\rho = \begin{pmatrix}
  1 & \rho_{12} & \rho_{13}\\
  \rho_{12} & 1 & \rho_{23}\\
  \rho_{13} & \rho_{23} & 1\\
 \end{pmatrix} = \begin{pmatrix}
  1 & 0.4 & -0.2\\
  0.4 & 1 & -0.1\\
  -0.2 & -0.1 & 1\\
 \end{pmatrix}\\
\Sigma = \text{diag}(\sigma) \, \rho \; \text{diag}(\sigma) = \begin{pmatrix}
  0.053 & 0.020 & -0.006 \\ 
  0.020 & 0.048 & -0.003 \\ 
  -0.006 & -0.003 & 0.014 \\ 
  \end{pmatrix}
$$

```R
mus = c(0.11, 0.10, 0.07)
sds = c(0.23, 0.22, 0.12)

corr = matrix(data = c(1,0.4,-0.2, 0.4,1,-0.1, -0.2,-0.1,1), nrow = 3, ncol = 3)

cov = diag(sds) %*% corr %*% diag(sds)
```

We now want to construct an efficient portfolio $w_{eff}$ according to the Mean/Variance framework with a yearly target return of $\mu_{target} = 0.1$. Additionally we calculate the global minimum variance portfolio $w_{gmv}$ using the solutions provided by the Mean/Variance framework. Additionally we calculate the expected means and volatilities of the portfolios:
$$
w_{eff} = \begin{pmatrix}{}
  0.53 \\ 
  0.29 \\ 
  0.18 \\ 
  \end{pmatrix}, \; \mu_{p eff} = \mu_{target} = 0.1,  \; \sigma_{p eff} = 0.156\\
w_{gmv} = \begin{pmatrix}{}
  0.18 \\ 
  0.14 \\ 
  0.68 \\ 
  \end{pmatrix},  \; \mu_{p gmv} = 0.081, \; \sigma_{p gmv} = 0.092
$$

```R
mu.p = function(w, mus) mus %*% w
sd.p = function(w, cov) sqrt(t(w) %*% cov %*% w)

w.opt = solve.min_var(0.1, mus, cov)
w.gmv = solve.gmv(mus, cov)


target.mus = seq(0.01, 0.15, by = 0.001)
ws.efficient = sapply(target.mus, function(target.mu) solve.min_var(target.mu, mus, cov))
mus.efficient = apply(ws.efficient, 2, function(w) mu.p(w, mus))
sds.efficient = apply(ws.efficient, 2, function(w) sd.p(w, cov))
```

We plot the assets, the efficient portfolio, the global minimum variance portfolio and the efficient frontier (representing all obtainable efficient portfolios) in the standard deviation vs. expected return space:
![Example: Mean/Var plot](./mean-var-ex-plot.png)

Investing in the efficient portfolio with target return 10%, would mean putting 53% and 29% of our wealth in stock 1 and 2, and the remainder of 18% into the bond. Our constructed portfolio has as nearly as much expected return as the stocks ($\mu_{p eff} = 10\%$), while having much lower standard deviation of $\sigma_{p eff} = 15.6\%$. We also clearly see, the global minimum variance portfolio has the lowest standard deviation among all obtainable portfolios ($\sigma_{p gmv} = 9.2\%$).


```R
par(mfrow=c(1, 1),
  oma = c(0,0,0.5,0) + 0.1,
  mar = c(4,8,0.5,4) + 0.1)

plot(sds, mus, xlim=c(0, 0.3), ylim=c(0.03, 0.15),xlab=expression(sigma), ylab=expression(mu), pch=19, cex=2)
lines(sds.efficient, mus.efficient)
lines(y = c(0.1, 0.1), x=c(-1, sd.p(w.opt, cov)), lty=2, col='red')
points(sd.p(w.opt, cov), mu.p(w.opt, mus), col='red', pch=19, cex=2)

points(sd.p(w.gmv, cov), mu.p(w.gmv, mus), col='green', pch=19, cex=2)

par(mfrow=c(1, 1))
```

## Different formulations 

Different formulations for the efficient portfolio formulation (as defined in the preceding chapter) have been discussed, e.g. by introducing a risk free asset, incorporating additional constraints into the optimization problem, such as transaction cost constraints, maximum holding constraints, or by using a different optimization function, by not minimizing the variance but instead, for example, the value at risk.
   
One important constraint, which was already discussed by Markowitz in his original paper, and which we will be using in our experiments, is the short sale constraint, which disallows short-selling, i.e. all individual asset weights must be greater than or equal to 0. This is a constraint, with  which many investors are confronted in practice, since short-selling may involve regulatory (short selling may be disallowed for certain accounts) or practical hurdles (short selling involves  borrowing an asset from a third party which is willing to lend, which may not be available, also this could incorporate additional short-sale fees). 
To solve the portfolio optimization problem with the short sale constraint analytically, an iterative Kuhn-Tucker approach can be used \citep[e.g., see][]{jagannathan2002risk}. Also numerical optimizers, i.e., linear-quadratic solvers, efficiently implement this iterative approach.


## Appendix: Utility maximization formulation
 
When using the efficient portfolio formulation, one has to choose a target return, which is not always obvious. There is an alternative formulation, in which the expected utility of the investor is directly optimized. It can be shown that the unconstrained minimum variance formulation (by Markowitz) and the utility maximization formulation are equivalent. For this formulation one has to choose a risk aversion parameter $\lambda$, however this parameter has a much more practical interpretation, defining the marginal rate of substitution between expected return and return variance. 

A rational investor wants to maximize its expected utility and therefore the problem can be defined as:
$$
w^* = \argmax_{w} \mathbb{E} (u(\boldsymbol{\mathbf{R_P}}))\\
= \argmax_{w}  \mu_P - \frac{\lambda}{2} \sigma_P^2\\
= \argmax_{w}  w^T \mu - \frac{\lambda}{2} w^T \Sigma w\\
\text{s.t. } 1^T w = 1
$$


# Portfolio selection

In this chapter we discuss the original theory of Markowitz based portfolio optimization, then we get into the details of Bayesian based methods. Next we present the ideas of utility theory and how the utility of individual investors are modeled in economics, followed by a detailed view on direct expected utility optimization. The chapter is completed by taking a look on some theoretical aspects of historical simulation, in particular some pitfalls of backtesting.

## Markowitz portfolio optimization 
% ----------------------------------------------------------------------------------
% ----------------------------------------------------------------------------------
% ----------------------------------------------------------------------------------

Markowitz introduced the Mean-Variance framework (also called Modern Portfolio Theory) in his article \cite{markowitz1952portfolio}. 
He introduced the process of selecting an optimal portfolio for an investor by dividing it into two stages.
The first stage is concerned about the future performance of the available financial assets and results in a set of quantified characteristics about this assets. The second stage is concerned about building an optimized portfolio, this is accomplished by taking the quantified characteristics of the financial assets in the first stage and optimizing the portfolio according to some goal function such as the investors expected utility. He concentrates only on two of these quantified characteristics of financial assets, namely the expected value and variance of the portfolio (hence the name Mean/Variance framework) and argues that the investor desires expected return and does not desire variance (i.e. uncertainty). One could argue the best way to build a portfolio is by maximizing only the expected (discounted) return and ignoring the variance, but Markowitz rejects this hypothesis and argues that this would never imply that there is a diversified portfolio which is preferable over a expected value optimized portfolio, but diversification is both observed and sensible, and therefore does not imply the superiority of diversification and thus must be rejected.

\paragraph{Problem formulation}

This section is mainly based on \cite{markowitz1952portfolio} and the detailed explanations of \cite{chapados2011portfolio}.

**Asset return** We have a risky financial asset, e.g. a stock share, index\footnote{Indices are a collection financial assets, e.g the top 10 stocks in Europe based on market capitalization of their respective companies, which can often be directly traded using ETFs (exchange traded funds)} or a bond, which has a market price $p_t$ at time $t$, for which the financial asset can be bought or sold. We define the (simple/discrete) return for period $t-1$ to $t$ of the asset as the relative change of the price subtracted by 1:
$$
r_t = \frac{p_{t}}{p_{t-1}} - 1
$$

**The portfolio** We have an investable universe of $j = 1..S$ risky financial assets, and an investor chooses a portfolio at time $t$, i.e. allocates his wealth among the $S$ assets, based on the expectations on the unknown and therefore random returns $\boldsymbol{\mathbf{R_{t+1}}} \in \mathbb{R}^S$ for period $t$ to $t+1$. Usually the investors portfolio is expressed in terms of the portfolio weight vector $w \in \mathbb{R}^S$, where $w_j$ is the fraction of the total capital invested in asset $j$ in period $t$ to $t+1$.

**Means and the covariance matrix of returns** As said, in the Mean/Variance framework for choosing a portfolio the investor only takes into account the means $\mu \in \mathbb{R}^S$ of the returns and covariances $\Sigma \in \mathbb{R}^S \times \mathbb{R}^S$ between the returns: 
$$
\mu = \mathbb{E} (\boldsymbol{\mathbf{R_{t+1}}})\\
\Sigma = \text{Cov} (\boldsymbol{\mathbf{R_{t+1}}})
$$
The real $\mu$ and $\Sigma$ are typically unknown. 
One common method to estimate $\mu$ and $\Sigma$ is to use historical return data up to time $t$ and to calculate the maximum likelihood estimations of  $\mu$ and $\Sigma$ based on the historical returns from some period $t-t_{start}$ to $t$. This period $t-t_{start}$ to $t$ is also called the look-back period.

**Means and variance of the portfolio** After obtaining $\mu$ and $\Sigma$, or a proxy thereof, we can calculate the expected return $\mu_P$ and variance of the portfolio $\sigma_P^2$ in terms of the means and the covariance matrix of returns.
$$
\mu_P = w^T \mu\\
\sigma_P^2 = w^T \Sigma w
$$

**Markowitz efficient portfolio** A portfolio $w$ is efficient when it has the lowest variance among all obtainable portfolios for a given $\mu_{\text{target}}$, where $\mu_{\text{target}}$ is the pre-chosen target expected portfolio return (Minimum variance formulation). One additional constraint is that the portfolio must be fully invested, i.e. the portfolio weights must sum to one\footnote{$\mathbf{1}$ is the ones vector of size S, i.e. the vector with all components being 1}:
$$
w_{eff} = \argmin_{w} \frac{1}{2} \sigma_P^2\\
= \argmin_{w} \frac{1}{2} w^T \Sigma w\\
\text{s.t. }w^T \mu = \mu_{\text{target}}\\
\mathbf{1}^T w = 1
$$

Deriving the analytical solutions for the efficient portfolio problem is straightforward using the method of Lagrange multipliers, which can be found, e.g., in \cite{chapados2011portfolio} or in the R-Code for Example \ref{ex:mv-opt} in Appendix \ref{file:efficient_frontier}.

Analogue to the efficient portfolio, one can obtain the global minimum variance portfolio $w_{gmv}$, which is the portfolio with the least variance among all obtainable portfolio. The optimization formulation is equivalent to the efficient portfolio formulation, but without the target return constraint. The solution for $w_{gmv}$ is:
$$
w_{gmv} = \frac{\Sigma^{-1} \mathbf{1}}{\mathbf{1}^T \Sigma^{-1} \mathbf{1}}
$$
# Mean/Variance portfolio selection with R

Markowitz introduced the Mean-Variance framework (also called Modern
Portfolio Theory) in his original article [1]. He introduced the process of
selecting an optimal portfolio for an investor by dividing it into two
stages. 

The first stage is concerned about the future performance of the
available financial assets and results in a set of quantified
characteristics about this assets. 

The second stage is concerned about
building an optimized portfolio, this is accomplished by taking the
quantified characteristics of the financial assets in the first stage
and optimizing the portfolio according to some goal function such as the
investors expected utility. 

Markowitz concentrates only on two of these
quantified characteristics of financial assets, namely the expected
value and variance of the portfolio (hence the name Mean/Variance
framework) and argues that the investor desires expected return and does
not desire variance (i.e. uncertainty). 

One could argue the best way to
build a portfolio is by maximizing only the expected (discounted) return
and ignoring the variance, but Markowitz rejects this hypothesis and
argues that this would never imply that there is a diversified portfolio
which is preferable over a expected value optimized portfolio, but
diversification is both observed and sensible, and therefore does not
imply the superiority of diversification and thus must be rejected.

#### Problem formulation

**Asset return** We have a risky financial asset, e.g. a stock share,
index or a bond, which has a market price  $p_t$ at time $t$, for which the financial asset can be bought or sold. We define the (simple/discrete) return for period $t-1$ to $t$ of the asset as the relative change of the price subtracted by 1:

$$
r_t = \frac{p_{t}}{p_{t-1}} - 1
$$


**The portfolio** We have an investable universe of $j = 1..S$ risky financial assets, and an investor chooses a portfolio at time $t$, i.e. allocates his wealth among the $S$ assets, based on the expectations on the unknown and therefore random returns $\boldsymbol{\mathbf{R_{t+1}}} \in \mathbb{R}^S$ for period $t$ to $t+1$. Usually the investors portfolio is expressed in terms of the portfolio weight vector $w \in \mathbb{R}^S$, where $w_j$ is the fraction of the total capital invested in asset $j$ in period $t$ to $t+1$.

**Means and the covariance matrix of returns** As said, in the Mean/Variance framework for choosing a portfolio the investor only takes into account the means $\mu \in \mathbb{R}^S$ of the returns and covariances $\Sigma \in \mathbb{R}^S \times \mathbb{R}^S$ between the returns: 
$$
\mu = \mathbb{E} (\boldsymbol{\mathbf{R_{t+1}}})\\
\Sigma = \text{Cov} (\boldsymbol{\mathbf{R_{t+1}}})
$$
The real $\mu$ and $\Sigma$ are typically unknown. 
One common method to estimate $\mu$ and $\Sigma$ is to use historical return data up to time $t$ and to calculate the maximum likelihood estimations of  $\mu$ and $\Sigma$ based on the historical returns from some period $t-t_{start}$ to $t$. This period $t-t_{start}$ to $t$ is also called the look-back period.

**Means and variance of the portfolio** After obtaining $\mu$ and $\Sigma$, or a proxy thereof, we can calculate the expected return $\mu_P$ and variance of the portfolio $\sigma_P^2$ in terms of the means and the covariance matrix of returns.
$$
\mu_P = w^T \mu\\
\sigma_P^2 = w^T \Sigma w
$$

**Markowitz efficient portfolio** A portfolio $w$ is efficient when it has the lowest variance among all obtainable portfolios for a given $\mu_{\text{target}}$, where $\mu_{\text{target}}$ is the pre-chosen target expected portfolio return (Minimum variance formulation). One additional constraint is that the portfolio must be fully invested, i.e. the portfolio weights must sum to one:
$$
w_{eff} = \argmin_{w} \frac{1}{2} \sigma_P^2\\
= \argmin_{w} \frac{1}{2} w^T \Sigma w\\
\text{s.t. }w^T \mu = \mu_{\text{target}}\\
1^T w = 1
$$

Deriving the analytical solutions for the efficient portfolio problem is straightforward using the method of Lagrange multipliers.

```R
solve.min_var = function(target.mu, mus, cov) {
  ones = rep(1, length(mus))
  cov.inv = solve(cov)
  a = t(ones) %*% cov.inv %*% ones
  b = t(ones) %*% cov.inv %*% mus
  c = t(mus) %*% cov.inv %*% mus
  
  delta = a * c - b^2
  l1 = (c - b * target.mu) / delta
  l2 = (a*target.mu - b) / delta
  
  cov.inv %*% (as.numeric(l1) * ones + as.numeric(l2) * mus)
}

```


Analogue to the efficient portfolio, one can obtain the global minimum variance portfolio $w_{gmv}$, which is the portfolio with the least variance among all obtainable portfolio. The optimization formulation is equivalent to the efficient portfolio formulation, but without the target return constraint. The solution for $w_{gmv}$ is:
$$
w_{gmv} = \frac{\Sigma^{-1} \mathbb{1}}{\mathbb{1}^T \Sigma^{-1} 1}
$$

```R
solve.gmv = function(mus, cov) {
  ones = rep(1, length(mus))
  (solve(cov) %*% ones) / as.numeric(t(ones) %*% solve(cov) %*% ones)
}
```

## An example

We have a hypothetical investable universe of three risky financial assets consisting of two stocks and one bond. We assume the two stocks have yearly expected returns $\mu_1 = 11\%, \mu_2 = 10\%$ and yearly expected volatility of $\sigma_1 = 23\%, \sigma_2 = 22\%$ and a correlation of $\rho_{12} = 0.4$. The bond has a slightly lower yearly return and risk of $\mu_3 = 7\%$ and $\sigma_3 = 12\%$. We assume the bond has a negative correlation to the stocks: $\rho_{13} = -0.2, \rho_{23} = -0.1$.

We can construct the mean vector $\mu$ and covariance matrix $\Sigma$, using the standard deviations $\sigma$ and the correlations $\rho$:

> Given a vector $x \in \mathbb{R}^S$ the $\text{diag}(x)$ function returns a matrix $\in \mathbb{R}^{S \times S}$ with the components of $x$ on the diagonal

$$
\mu = \begin{pmatrix}
  \mu_1\\
  \mu_2\\
  \mu_3\\
 \end{pmatrix} = \begin{pmatrix}
  0.11\\
  0.1\\
  0.07\\
 \end{pmatrix}, \sigma = \begin{pmatrix}
  \sigma_1\\
  \sigma_2\\
  \sigma_3\\
 \end{pmatrix} = \begin{pmatrix}
  0.23\\
  0.22\\
  0.12\\
 \end{pmatrix}\\
\rho = \begin{pmatrix}
  1 & \rho_{12} & \rho_{13}\\
  \rho_{12} & 1 & \rho_{23}\\
  \rho_{13} & \rho_{23} & 1\\
 \end{pmatrix} = \begin{pmatrix}
  1 & 0.4 & -0.2\\
  0.4 & 1 & -0.1\\
  -0.2 & -0.1 & 1\\
 \end{pmatrix}\\
\Sigma = \text{diag}(\sigma) \, \rho \; \text{diag}(\sigma) = \begin{pmatrix}
  0.053 & 0.020 & -0.006 \\ 
  0.020 & 0.048 & -0.003 \\ 
  -0.006 & -0.003 & 0.014 \\ 
  \end{pmatrix}
$$

```R
mus = c(0.11, 0.10, 0.07)
sds = c(0.23, 0.22, 0.12)

corr = matrix(data = c(1,0.4,-0.2, 0.4,1,-0.1, -0.2,-0.1,1), nrow = 3, ncol = 3)

cov = diag(sds) %*% corr %*% diag(sds)
```

We now want to construct an efficient portfolio $w_{eff}$ according to the Mean/Variance framework with a yearly target return of $\mu_{target} = 0.1$. Additionally we calculate the global minimum variance portfolio $w_{gmv}$ using the solutions provided by the Mean/Variance framework. Additionally we calculate the expected means and volatilities of the portfolios:
$$
w_{eff} = \begin{pmatrix}{}
  0.53 \\ 
  0.29 \\ 
  0.18 \\ 
  \end{pmatrix}, \; \mu_{p eff} = \mu_{target} = 0.1,  \; \sigma_{p eff} = 0.156\\
w_{gmv} = \begin{pmatrix}{}
  0.18 \\ 
  0.14 \\ 
  0.68 \\ 
  \end{pmatrix},  \; \mu_{p gmv} = 0.081, \; \sigma_{p gmv} = 0.092
$$

```R
mu.p = function(w, mus) mus %*% w
sd.p = function(w, cov) sqrt(t(w) %*% cov %*% w)

w.opt = solve.min_var(0.1, mus, cov)
w.gmv = solve.gmv(mus, cov)


target.mus = seq(0.01, 0.15, by = 0.001)
ws.efficient = sapply(target.mus, function(target.mu) solve.min_var(target.mu, mus, cov))
mus.efficient = apply(ws.efficient, 2, function(w) mu.p(w, mus))
sds.efficient = apply(ws.efficient, 2, function(w) sd.p(w, cov))
```

We plot the assets, the efficient portfolio, the global minimum variance portfolio and the efficient frontier (representing all obtainable efficient portfolios) in the standard deviation vs. expected return space:
![Example: Mean/Var plot](./mean-var-ex-plot.png)

Investing in the efficient portfolio with target return 10%, would mean putting 53% and 29% of our wealth in stock 1 and 2, and the remainder of 18% into the bond. Our constructed portfolio has as nearly as much expected return as the stocks ($\mu_{p eff} = 10\%$), while having much lower standard deviation of $\sigma_{p eff} = 15.6\%$. We also clearly see, the global minimum variance portfolio has the lowest standard deviation among all obtainable portfolios ($\sigma_{p gmv} = 9.2\%$).


```R
par(mfrow=c(1, 1),
  oma = c(0,0,0.5,0) + 0.1,
  mar = c(4,8,0.5,4) + 0.1)

plot(sds, mus, xlim=c(0, 0.3), ylim=c(0.03, 0.15),xlab=expression(sigma), ylab=expression(mu), pch=19, cex=2)
lines(sds.efficient, mus.efficient)
lines(y = c(0.1, 0.1), x=c(-1, sd.p(w.opt, cov)), lty=2, col='red')
points(sd.p(w.opt, cov), mu.p(w.opt, mus), col='red', pch=19, cex=2)

points(sd.p(w.gmv, cov), mu.p(w.gmv, mus), col='green', pch=19, cex=2)

par(mfrow=c(1, 1))
```

## Different formulations 

Different formulations for the efficient portfolio formulation (as defined in the preceding chapter) have been discussed, e.g. by introducing a risk free asset, incorporating additional constraints into the optimization problem, such as transaction cost constraints, maximum holding constraints, or by using a different optimization function, by not minimizing the variance but instead, for example, the value at risk.
   
One important constraint, which was already discussed by Markowitz in his original paper, and which we will be using in our experiments, is the short sale constraint, which disallows short-selling, i.e. all individual asset weights must be greater than or equal to 0. This is a constraint, with  which many investors are confronted in practice, since short-selling may involve regulatory (short selling may be disallowed for certain accounts) or practical hurdles (short selling involves  borrowing an asset from a third party which is willing to lend, which may not be available, also this could incorporate additional short-sale fees). 
To solve the portfolio optimization problem with the short sale constraint analytically, an iterative Kuhn-Tucker approach can be used \citep[e.g., see][]{jagannathan2002risk}. Also numerical optimizers, i.e., linear-quadratic solvers, efficiently implement this iterative approach.


## Appendix: Utility maximization formulation
 
When using the efficient portfolio formulation, one has to choose a target return, which is not always obvious. There is an alternative formulation, in which the expected utility of the investor is directly optimized. It can be shown that the unconstrained minimum variance formulation (by Markowitz) and the utility maximization formulation are equivalent. For this formulation one has to choose a risk aversion parameter $\lambda$, however this parameter has a much more practical interpretation, defining the marginal rate of substitution between expected return and return variance. 

A rational investor wants to maximize its expected utility and therefore the problem can be defined as:
$$
w^* = \argmax_{w} \mathbb{E} (u(\boldsymbol{\mathbf{R_P}}))\\
= \argmax_{w}  \mu_P - \frac{\lambda}{2} \sigma_P^2\\
= \argmax_{w}  w^T \mu - \frac{\lambda}{2} w^T \Sigma w\\
\text{s.t. } 1^T w = 1
$$


# Portfolio selection

In this chapter we discuss the original theory of Markowitz based portfolio optimization, then we get into the details of Bayesian based methods. Next we present the ideas of utility theory and how the utility of individual investors are modeled in economics, followed by a detailed view on direct expected utility optimization. The chapter is completed by taking a look on some theoretical aspects of historical simulation, in particular some pitfalls of backtesting.

## Markowitz portfolio optimization 
% ----------------------------------------------------------------------------------
% ----------------------------------------------------------------------------------
% ----------------------------------------------------------------------------------

Markowitz introduced the Mean-Variance framework (also called Modern Portfolio Theory) in his article \cite{markowitz1952portfolio}. 
He introduced the process of selecting an optimal portfolio for an investor by dividing it into two stages.
The first stage is concerned about the future performance of the available financial assets and results in a set of quantified characteristics about this assets. The second stage is concerned about building an optimized portfolio, this is accomplished by taking the quantified characteristics of the financial assets in the first stage and optimizing the portfolio according to some goal function such as the investors expected utility. He concentrates only on two of these quantified characteristics of financial assets, namely the expected value and variance of the portfolio (hence the name Mean/Variance framework) and argues that the investor desires expected return and does not desire variance (i.e. uncertainty). One could argue the best way to build a portfolio is by maximizing only the expected (discounted) return and ignoring the variance, but Markowitz rejects this hypothesis and argues that this would never imply that there is a diversified portfolio which is preferable over a expected value optimized portfolio, but diversification is both observed and sensible, and therefore does not imply the superiority of diversification and thus must be rejected.

\paragraph{Problem formulation}

This section is mainly based on \cite{markowitz1952portfolio} and the detailed explanations of \cite{chapados2011portfolio}.

**Asset return** We have a risky financial asset, e.g. a stock share, index\footnote{Indices are a collection financial assets, e.g the top 10 stocks in Europe based on market capitalization of their respective companies, which can often be directly traded using ETFs (exchange traded funds)} or a bond, which has a market price $p_t$ at time $t$, for which the financial asset can be bought or sold. We define the (simple/discrete) return for period $t-1$ to $t$ of the asset as the relative change of the price subtracted by 1:
$$
r_t = \frac{p_{t}}{p_{t-1}} - 1
$$

**The portfolio** We have an investable universe of $j = 1..S$ risky financial assets, and an investor chooses a portfolio at time $t$, i.e. allocates his wealth among the $S$ assets, based on the expectations on the unknown and therefore random returns $\boldsymbol{\mathbf{R_{t+1}}} \in \mathbb{R}^S$ for period $t$ to $t+1$. Usually the investors portfolio is expressed in terms of the portfolio weight vector $w \in \mathbb{R}^S$, where $w_j$ is the fraction of the total capital invested in asset $j$ in period $t$ to $t+1$.

**Means and the covariance matrix of returns** As said, in the Mean/Variance framework for choosing a portfolio the investor only takes into account the means $\mu \in \mathbb{R}^S$ of the returns and covariances $\Sigma \in \mathbb{R}^S \times \mathbb{R}^S$ between the returns: 
$$
\mu = \mathbb{E} (\boldsymbol{\mathbf{R_{t+1}}})\\
\Sigma = \text{Cov} (\boldsymbol{\mathbf{R_{t+1}}})
$$
The real $\mu$ and $\Sigma$ are typically unknown. 
One common method to estimate $\mu$ and $\Sigma$ is to use historical return data up to time $t$ and to calculate the maximum likelihood estimations of  $\mu$ and $\Sigma$ based on the historical returns from some period $t-t_{start}$ to $t$. This period $t-t_{start}$ to $t$ is also called the look-back period.

**Means and variance of the portfolio** After obtaining $\mu$ and $\Sigma$, or a proxy thereof, we can calculate the expected return $\mu_P$ and variance of the portfolio $\sigma_P^2$ in terms of the means and the covariance matrix of returns.
$$
\mu_P = w^T \mu\\
\sigma_P^2 = w^T \Sigma w
$$

**Markowitz efficient portfolio** A portfolio $w$ is efficient when it has the lowest variance among all obtainable portfolios for a given $\mu_{\text{target}}$, where $\mu_{\text{target}}$ is the pre-chosen target expected portfolio return (Minimum variance formulation). One additional constraint is that the portfolio must be fully invested, i.e. the portfolio weights must sum to one\footnote{$\mathbf{1}$ is the ones vector of size S, i.e. the vector with all components being 1}:
$$
w_{eff} = \argmin_{w} \frac{1}{2} \sigma_P^2\\
= \argmin_{w} \frac{1}{2} w^T \Sigma w\\
\text{s.t. }w^T \mu = \mu_{\text{target}}\\
\mathbf{1}^T w = 1
$$

Deriving the analytical solutions for the efficient portfolio problem is straightforward using the method of Lagrange multipliers, which can be found, e.g., in \cite{chapados2011portfolio} or in the R-Code for Example \ref{ex:mv-opt} in Appendix \ref{file:efficient_frontier}.

Analogue to the efficient portfolio, one can obtain the global minimum variance portfolio $w_{gmv}$, which is the portfolio with the least variance among all obtainable portfolio. The optimization formulation is equivalent to the efficient portfolio formulation, but without the target return constraint. The solution for $w_{gmv}$ is:
$$
w_{gmv} = \frac{\Sigma^{-1} \mathbf{1}}{\mathbf{1}^T \Sigma^{-1} \mathbf{1}}
$$

**Utility maximization formulation** When using the efficient portfolio formulation, one has to choose a target return, which is not always obvious. There is an alternative formulation, in which the expected utility of the investor is directly optimized. It can be shown \citep[][e.g., see]{chapados2011portfolio} that the unconstrained minimum variance formulation (by Markowitz) and the utility maximization formulation are equivalent. For this formulation one has to choose a risk aversion parameter $\lambda$, however this parameter has a much more practical interpretation, defining the marginal rate of substitution between expected return and return variance. As pointed out in Section \ref{sec:utility} a rational investor wants to maximize its expected utility and therefore the problem can be defined as:
$$
w^* = \argmax_{w} \mathbb{E} (u(\boldsymbol{\mathbf{R_P}}))\\
= \argmax_{w}  \mu_P - \frac{\lambda}{2} \sigma_P^2\\
= \argmax_{w}  w^T \mu - \frac{\lambda}{2} w^T \Sigma w\\
\text{s.t. }  \mathbf{1}^T w = 1
$$



\begin{example}[Mean/Variance optimization]


We have a hypothetical investable universe of three risky financial assets consisting of two stocks and one bond. We assume the two stocks have yearly expected returns $\mu_1 = 11\%, \mu_2 = 10\%$ and yearly expected volatility of $\sigma_1 = 23\%, \sigma_2 = 22\%$ and a correlation of $\rho_{12} = 0.4$. The bond has a slightly lower yearly return and risk of $\mu_3 = 7\%$ and $\sigma_3 = 12\%$. We assume the bond has a negative correlation to the stocks: $\rho_{13} = -0.2, \rho_{23} = -0.1$.

We can construct the mean vector $\mu$ and covariance matrix $\Sigma$, using the standard deviations $\sigma$ and the correlations $\rho$:\footnote{Given a vector $x \in \mathbb{R}^S$ the $\text{diag}(x)$ function returns a matrix $\in \mathbb{R}^{S \times S}$ with the components of $x$ on the diagonal}
$$
\mu = \begin{pmatrix}
  \mu_1\\
  \mu_2\\
  \mu_3\\
 \end{pmatrix} = \begin{pmatrix}
  0.11\\
  0.1\\
  0.07\\
 \end{pmatrix}, \sigma = \begin{pmatrix}
  \sigma_1\\
  \sigma_2\\
  \sigma_3\\
 \end{pmatrix} = \begin{pmatrix}
  0.23\\
  0.22\\
  0.12\\
 \end{pmatrix}\\
\rho = \begin{pmatrix}
  1  \rho_{12}  \rho_{13}\\
  \rho_{12}  1  \rho_{23}\\
  \rho_{13}  \rho_{23}  1\\
 \end{pmatrix} = \begin{pmatrix}
  1  0.4  -0.2\\
  0.4  1  -0.1\\
  -0.2  -0.1  1\\
 \end{pmatrix}\\
\Sigma = \text{diag}(\sigma) \, \rho \; \text{diag}(\sigma) = \begin{pmatrix}
  0.053  0.020  -0.006 \\ 
  0.020  0.048  -0.003 \\ 
  -0.006  -0.003  0.014 \\ 
  \end{pmatrix}
$$

We now want to construct an efficient portfolio $w_{eff}$ according to the Mean/Variance framework with a yearly target return of $\mu_{target} = 0.1$. Additionally we calculate the global minimum variance portfolio $w_{gmv}$ using the solutions provided by the Mean/Variance framework. Additionally we calculate the expected means and volatilities of the portfolios:
$$
w_{eff} = \begin{pmatrix}{}
  0.53 \\ 
  0.29 \\ 
  0.18 \\ 
  \end{pmatrix}, \; \mu_{p eff} = \mu_{target} = 0.1,  \; \sigma_{p eff} = 0.156\\
w_{gmv} = \begin{pmatrix}{}
  0.18 \\ 
  0.14 \\ 
  0.68 \\ 
  \end{pmatrix},  \; \mu_{p gmv} = 0.081, \; \sigma_{p gmv} = 0.092
$$

We plot the assets, the efficient portfolio, the global minimum variance portfolio and the efficient frontier (representing all obtainable efficient portfolios) in the standard deviation vs. expected return space:
\begin{figure}[H]
\centerline{\includegraphics[scale=0.4]{img/mean-var-ex-plot.pdf}}
 \caption{Example \ref{ex:mv-opt} (Mean/Variance optimization): Black dots: The three assets, Red dot: The efficient portfolio for a target return of 10\%, Green dot: The global minimum variance portfolio, Black curve: The efficient frontier}
 
\end{figure}

Investing in the efficient portfolio with target return 10\%, would mean putting 53\% and 29\% of our wealth in stock 1 and 2, and the remainder of 18\% into the bond. Our constructed portfolio has as nearly as much expected return as the stocks ($\mu_{p eff} = 10\%$), while having much lower standard deviation of $\sigma_{p eff} = 15.6\%$. We also clearly see, the global minimum variance portfolio has the lowest standard deviation among all obtainable portfolios ($\sigma_{p gmv} = 9.2\%$).

The R-Code for this example can be found in Appendix \ref{file:efficient_frontier}.

\end{example}


**Different formulations** Different formulations for the efficient portfolio formulation (as defined in the preceding chapter) have been discussed, e.g. by introducing a risk free asset, incorporating additional constraints into the optimization problem, such as transaction cost constraints, maximum holding constraints, or by using a different optimization function, by not minimizing the variance but instead, for example, the value at risk.

One important constraint, which was already discussed by Markowitz in his original paper, and which we will be using in our experiments, is the short sale constraint, which disallows short-selling, i.e. all individual asset weights must be greater than or equal to 0. This is a constraint, with  which many investors are confronted in practice, since short-selling may involve regulatory (short selling may be disallowed for certain accounts) or practical hurdles (short selling involves  borrowing an asset from a third party which is willing to lend, which may not be available, also this could incorporate additional short-sale fees). 
To solve the portfolio optimization problem with the short sale constraint analytically, an iterative Kuhn-Tucker approach can be used \citep[e.g., see][]{jagannathan2002risk}. Also numerical optimizers, i.e., linear-quadratic solvers, efficiently implement this iterative approach.


## Bayesian based portfolio optimization

In the last section, we introduced the Mean/Variance framework, which provides an formulation for selecting efficient portfolios for risky assets. \cite{avramov2010bayesian} in their survey of Bayesian portfolio selection methods, name three arguments of why the Bayesian portfolio selection approach might be useful:

**Prior information** Pre-known knowledge can be incorporated into the models by using informative prior distributions.

**Parameter uncertainty** The Bayesian approach is one way (including other, non Bayesian techniques, see above) to deal with parameter uncertainty. The problem of parameter uncertainty is naturally incorporated by the Bayesian approach by treating the model parameters $\boldsymbol{\mathbf{\Theta}}$ as probability distributions instead of constants. 

**Convenience of numerical algorithms** Numerical algorithms allow a more declarative approach, where one can focus on the "modeling" part without worrying on the mathematically convenience and/or tractability of the models.

### The Bayesian framework to portfolio optimization

One can roughly divide Bayesian based approaches to portfolio selection into two groups (\cite{avramov2010bayesian}). The first group treats the asset returns as independent and identically distributed (iid), and concentrates on modeling the return distribution only conditional on the historical returns (e.g. by assuming a Multivariate Gaussian distribution and estimating the $\mu$ and $\Sigma$ parameters). The other group treats the asset returns as time dependent and therefore predictable. One example of such a predictable model is estimating a linear regression model where the return is the dependent variable and the independent variables are based on some economic measure, such as GDP growth and treasury bill rate.

An overview of the state of the art of Bayesian based portfolio selection approach is provided in the introduction in Section \ref{sec:stateofart}.

In this thesis, we concentrate on models in group one, i.e. on modeling the return distribution only conditional on the historical returns. In the Bayesian framework, the parameter vector $\boldsymbol{\mathbf{\Theta}}$, which contains all model parameters (e.g. $\boldsymbol{\mathbf{\mu}}$ and $\boldsymbol{\mathbf{\Sigma}}$ in a Multivariate Gaussian distribution setting), is treated as a random variable. For a detailed discussion of Bayesian inference, see Section \ref{sec:bayes-theorem}.

We define the model as the likelihood $p(X \: \vert \: \Theta)$, defining the probability density of the dataset $\boldsymbol{\mathbf{X}}$, given one particular assignment of the parameter vector $\boldsymbol{\mathbf{\Theta}}$, and $p(\Theta)$ the a-priori distribution of $\boldsymbol{\mathbf{\Theta}}$, which includes all knowledge about the parameters a-priori the inference, i.e. before we observe the data. Having a dataset $X$ available at time $t$ (in our case the historical returns of the financial assets up to time $t$), we can use the Bayesian inference formulation to get the a-posteriori distribution density $p(\Theta \: \vert \: X)$:
$$
p(\Theta \: \vert \: X) = \frac{p(X \: \vert \: \Theta) \cdot p(\Theta)}{\int_{\Theta} p(X \: \vert \: \Theta) \cdot p(\Theta) \; d\Theta}
$$

Having the joint posterior densities, we can then integrate out the parameters $\boldsymbol{\mathbf{\Theta}}$ to obtain the predictive return density:
$$
p(R_{t+1} \: \vert \: X) = \int_{\Theta} p(R_{t+1} \: \vert \: \Theta, X) \; d\Theta
$$

Then the Bayesian framework to portfolio optimization can be formulated as a utility maximization of the predictive return distribution (\cite{avramov2010bayesian}):
$$
w_{Bayes} = \argmax_w \int_{R_{t+1}} u(w) \; p(R_{t+1} \: \vert \: X) \; dR_{t+1}
$$

In our case study we use different Bayesian models to estimate $\boldsymbol{\mathbf{\Theta}} \: \vert \: X$, which are further motivated in Section \ref{sec:bayes-models}. We approximate the predictive return density with Markov Chain Monte Carlo by numerically integrating out the parameters. We then calculate the optimal portfolio using direct expected utility optimization (Section \ref{sec:direct-expected-utility}).

### Using the Bayesian framework for Mean/Variance optimization


The Mean/Variance framework uses the first two moments of the return distribution (the expected value $\mu$ and the variance-covariance matrix $\Sigma$) to calculate an efficient portfolio. In a Bayesian setting, we can obtain the expected value $\mu = \mathbb{E}(\boldsymbol{\mathbf{R_{t+1}} \: \vert \: X})$ and variance $\Sigma = Var(\boldsymbol{\mathbf{R_{t+1}} \: \vert \: X})$ of the predictive return distribution $\boldsymbol{\mathbf{R_{t+1}} \: \vert \: X}$. As \cite{polson2000bayesian} points out, these statistics can be calculated as\footnote{$Var(R_{t+1} \: \vert \: X)$ is decomposed using the law of total variance (see \cite{weiss2005course})}:
$$
\mu = \mathbb{E}(\boldsymbol{\mathbf{R_{t+1}} \: \vert \: X}) = \mathbb{E}(\boldsymbol{\mathbf{\mu \: \vert \: X}})\\
\Sigma = Var(\boldsymbol{\mathbf{R_{t+1}} \: \vert \: X})\\ 
=\mathbb{E}(Var(\boldsymbol{\mathbf{R_{t+1}} \: \vert \: \mu, \Sigma, X})) + Var(\mathbb{E}(\boldsymbol{\mathbf{R_{t+1}} \: \vert \: \mu, \Sigma, X}))\\
=\mathbb{E}(\boldsymbol{\mathbf{\Sigma \: \vert \: X}}) + Var(\boldsymbol{\mathbf{\mu \: \vert \: X}})
$$

As we can see, we can calculate the expected value for the predictive return distribution using the expected value of the marginal a-posteriori mean $\boldsymbol{\mathbf{\mu \: \vert \: X}}$. For the variance of the predictive return distribution we can use the marginal a-posteriori variance-covariance matrix $\boldsymbol{\mathbf{\Sigma \: \vert \: X}}$, as one would expect, but we have to add an additional term to correct for parameter uncertainty, using the variance of the marginal a-posteriori mean $\boldsymbol{\mathbf{\mu \: \vert \: X}}$. 
This correction is consistent with a correction used for parameter uncertainty in a non-Bayesian setting \citep[e.g., see][]{dangl2017long}. 


## Utility 
% ----------------------------------------------------------------------------------
% ----------------------------------------------------------------------------------
% ----------------------------------------------------------------------------------

In this section, we provide a brief introduction to utility theory and show how and why we chose our utility function used for the direct expected utility optimization technique. This section is based on the texts by \cite{norstad1999introduction} and \cite{johnson2007utility}.

A utility function $u(m)$ is a function which maps from a measure of wealth to the perceived value of that wealth for an investor (\cite{johnson2007utility}). A utility is twice differentiable with the property of non-satiation, which means an investor always gets some additional utility by getting more wealth ($u'(m) > 0$) and the property of risk aversion ($u''(m) < 0$).

The principle of expected utility maximization states, that a rational investor, when faced with more than one possible outcome, chooses that action, which maximizes the expected utility (\cite{norstad1999introduction}). The classical Markowitz approach is consistent with this principle, since the Markowitz optimization approach can also be viewed as a expected utility maximization problem (see Section \ref{sec:markowitz-portfolio}).

In the portfolio optimization setting (see Section \ref{sec:markowitz-portfolio}) we are faced with this type of uncertainty, we have a set of possible outcomes (in our case the predictive return vector $\boldsymbol{\mathbf{R_{t+1}}}$ for a set of assets for the next period) and a set of possible actions (in our case choosing in which assets to invest, i.e. choosing the portfolio weight vector $w$).
To act according to the expected utility maximization we choose our portfolio such that our portfolio weights $w^* = \argmax_w \mathbb{E}(u(\boldsymbol{\mathbf{R_{t+1}}} w))$.

There is one important measure of utility functions which measures the relative risk aversion of a utility function based on a measure of wealth $m$ (\cite{johnson2007utility}):

$$Rr(m) = -m \frac{u''(m)}{u'(m)}$$

Relative risk aversion measures risk aversion to a loss relative to the investors wealth. Increasing relative risk aversion (IRRA)/Decreasing relative risk aversion (DRRA) state, that when his/her wealth increases he/she will hold more/less fractions of total wealth in risky assets. In the case of constant relative risk aversion (CRRA) the investor will hold the same fractions in risky assets as his/her wealth increases.

We assume the initial wealth in our experiments is an arbitrarily chosen number, e.g. 1 Mio. \$, and we don't want an influence of the absolute value of wealth to our portfolio choices in our experiments, so we choose the isoelastic utility function which has the CRRA property.
This also simplifies our calculations, since we can directly work with relative changes of the wealth instead of absolute value of wealth.

The isoelastic utility function (also called power-utility function or CRRA utility function) is given by:

$$u(m)={\begin{cases}{\frac  {m^{{1-\eta }}-1}{1-\eta }}&\eta \neq 1\\\ln(m)&\eta =1\end{cases}}$$

Where $\eta$ is the risk aversion and defines the risk preferences of the investor. 

There is an ongoing debate, on which value for $\eta$ is realistic for an average (human) investor. For our experiments we chose a value of $\eta = 3$, based on our own intuition. Using $\eta = 3$, the utility of gaining $20\%$ is $u(0.2) = 0.15$, whereas the utility of loosing $20\%$ of our wealth is $u(-0.2) = -0.28$, so about as twice as bad in terms of utility, which seems reasonable. For higher values of $\eta$ the utility falloff in the negative regions is much faster, e.g. for $\eta = 8$ the utility of loosing $20\%$ vs. gaining $20\%$ is 5 times as bad, which is in our opinion unrealistic. 

Since we don't have the case with $\eta=1$, and since we work with relative changes of wealth, rather than absolute changes of wealth, we redefine our utility function in terms of returns, substituting the wealth $m$ with the return $r$, $m = 1 + r$ (allowed because of the CRRA property): 
$$u(r)=\frac{(1+r)^{{1-\eta }}-1}{1-\eta}$$

In our experiments we work with monthly returns, after inspecting the dataset used in the case study (for details, see Section \ref{sec:dataset}), we found the returns roughly to be in the range of -20\% to 20\%. In Figure \ref{fig:crra-utility-plot} we plotted the utility functions in the relevant range.

\begin{figure}[H]
\includegraphics[scale=0.5]{img/crra-utility-plot.pdf}
\caption{CRRA utility function $u(r)$ for a relative change of wealth $r$, with risk aversion parameter $\eta = 3$ (left) and $\eta = 8$ (right). For our experiments we chose $\eta=3$.}

\end{figure}

### Direct expected utility maximization 

As said, to act according to the expected utility maximization we choose our portfolio such that our portfolio weights maximize the expected utility dependent the predictive return vector $\boldsymbol{\mathbf{R_{t+1}}}$\footnote{We use the notation $\mathbf{x}$ (bold) to denote a stochastic variable, vector or matrix, as opposed to $x$ which is an ordinary scalar, vector or matrix}. In this section we explain how we define the optimization problem and how we used the numerical optimization procedure called Sequential Quadratic Programming (SQP) to find a solution to the the constrained optimization problem.

As discussed in detail in Section \ref{sec:backtest}, we use the numerical Markov Chain Monte Carlo procedure to obtain $N$ representative samples from $\boldsymbol{\mathbf{R_{t+1}}}$ and can only approximate the expected utility by calculating the arithmetic average for the utility of each possible outcome. We obtain a sample-matrix $R^{(ij)} \in \mathbb{R}^{N \times S}$, which is a representation of the predictive return vector $\boldsymbol{\mathbf{R_{t+1}}}$, where each $j = 1..S$ column is one asset, and each $i = 1..N$ row is one representative sample (outcome) of $\boldsymbol{\mathbf{R_{t+1}}}$.

As discussed in the preceding section, we chose the isoelastic utility function $u(r) = \frac{(1 + r)^{1 - \eta} - 1}{1 - \eta}$, where $\eta$ denotes the risk aversion and $r$ the  portfolio return. For a theoretical discussion of utility theory and the isoelastic utility function see Section \ref{sec:utility}.

The goal of the procedure is, to calculate the portfolio weight vector $w \in \mathbb{R}^S$ for our portfolio which maximizes the expected utility. $w_j = c$ means we invest a fraction of $c$ of our portfolio in asset $j$. Furthermore we introduce two additional  optimization constraints: First, that we are fully invested (the portfolio weights sum to 1), and second, that no short sales are allowed (each weight is $\ge 0$).

\paragraph{Sequential Quadratic Programming}

Sequential Quadratic Programming (SQP) is one of the most successful (\cite{boggs1995sequential}) method for solving nonlinear constrained optimization methods of the form:
$$ 
\min_{x} \; f(x)\\
\text{s.t.:} \; g(x) = 0,\; h(x) \le 0\\
f:  \mathbb{R}^n \to  \mathbb{R}, \; h: \mathbb{R}^n \to  \mathbb{R}^m, \; g: \mathbb{R}^n \to  \mathbb{R}^p
$$

The idea in Sequential Quadratic Programming is to create an approximate solutions by constructing a quadratic programming subproblem, and then iteratively improve this solution by using the last solution as the starting point for the next subproblem. As SQP relies on quadratic subproblems, it benefits from the fact that there are very efficient algorithms for solving quadratic programming problems available. 

Fortunately there is an already implemented SQP procedure for R in the library \verb|nloptr| available. The SQP optimization is called with the function \verb|slsqp()|, which takes the target function to be minimized $f$, the gradient of $f$, the equality constraint functions $g_i$, the inequality constraint functions $h_i$. 

As said, we approximate the expected utility by calculating the arithmetic average of the utility of each of the $N$ samples. Our optimization problem is:
$$\max_{w} \mathbb{E} \big[ \, u(\boldsymbol{\mathbf{R_{t+1}}} w) \big] \approx \max_w \frac{1}{N} \sum_{i=1}^N \, u(\sum_{j=1}^S R^{(ij)} w_j)$$ 
$$\text{s.t. } \sum_{j=1}^S w_j = 1 \text{ and } w_j \ge 0 \; \forall \; j \in 1..S $$

We can eliminate the $w_j \ge 0$ constraints by substituting $w_j = v_j^2$. To switch from maximization to minimization we multiply the target function by $-1$.

$$f(v) = -\frac{1}{N} \sum_{i=1}^N \, u(\sum_{j=1}^S R^{(ij)} v_j^2) = -\frac{1}{N} \sum_{i=1}^N \, \frac{(1 + \sum_{j=1}^S R^{(ij)} v_j^2)^{1-\eta} - 1}{1-\eta}$$

$$g_1(v) = \sum_{j=1}^S (v_j^2) - 1 = 0$$

Then we derive the gradients as (for a proof, see Appendix \ref{sqp-gradient}):
$$ 
\frac{\partial{f}}{\partial{v_g}}	= -2 v_g  \frac{1}{N} \sum_{i=1}^N \Big[ R^{(ig)}  (1 + \sum_{j=1}^S R^{(ij)} v_j^2)^{-\eta} \Big]\\
\frac{\partial{g_1}}{\partial{v_g}}	= 2 v_g\\
$$

The implementation in R can be found in the file \verb|direct-expected-utility.R| function \verb|f.opt.sqp()|.

\paragraph{Convergence}

The SQP method, like other gradient based methods, guarantees only to find local extrema rather than the global extrema, i.e. the found extrema depend on the starting points. To investigate the global convergence behavior, we conducted a large number of experiments, where we initialized the starting points (in our case the weight vector) randomly using some artificially generated returns. We could not find a case where different starting points led to different extrema, so it seems that SQP always converges to the global extrema for our type of optimization formulation.

## Pitfalls of backtesting

In the case study in Section \ref{sec:case} we will be using a method called backtesting (also called historical simulation) to investigate the performance of our models in a simulated real-world scenario. For details, how we set up the backtesting procedure, take a look at Section \ref{sec:backtest}.

There are some pitfalls which one can fall into in the setup of a backtest which lowers the validity of the conducted experiments. In this section we discuss four commonly known pitfalls (\cite{defusco2015quantitative}) 
and how we set up our experiments in order to avoid them. 

\paragraph{Survivorship bias}

Survivorship biased data includes only winners, in the sense that companies, which went to bankruptcy got delisted or merged aren't included in the dataset (\cite{defusco2015quantitative}). This makes the results biased because a company which is bankrupt is likely to have lower returns on it's stock price than the average. \cite{shumway1997bias} shows that the survivorship bias is significant and that most datasets don't include delisting data. Also this bias applies when one selects a investment universe based on current data and then conducts a backtest based on that universe. One example is choosing a investment universe from the current constituents of the S\&P 500 and conducting a backtest, this biases the returns upwards, because companies which weren't in the S\&P 500 at the start of the experiment must have done well to be included, and also companies which were included in the S\&P 500 at the start of the experiment but aren't included in the investment universe because they are not part of the S\&P 500 anymore must have done badly. To avoid this kind of problem, one must use the constituent data from the start of the experiment.

We avoid this fallacy by using a dataset which includes constituent data, and only use such returns, which are member of the particular index.

\paragraph{Look-ahead bias} 

A backtest is look-ahead biased when it uses data which was not available at a particular time (\cite{defusco2015quantitative}). One example of this fallacy is a model, which uses accounting information (e.g. earnings report data) of a particular financial year of the company and makes decisions based on this data at the end of this financial year. This kind of setup is look-ahead biased but this is not that obvious, because for example using accounting data for the financial year $t$ at the end of year $t$ seems fine, however this kind of data is usually released much later and this information wasn't available at the end of year $t$ back then, so this use of data is clearly biased. Although the data is for the financial year $t$, one must use the data only after its original release date (e.g. year $t+1$) to get unbiased results.
Another not so obvious example of look-ahead bias is the following: Imagine a mean reversion model for a currency pair (e.g. EUR/USD) where we buy the currency, when it is below the mean value $\mu$, and sell the currency when it is above the mean value $\mu$. If we have a dataset $X_t$ which contains prices from time $t=0$ to $T$ and calculate the mean as $\mu = 1/T \sum_{t=0}^{T} X_t$ this experiment is clearly biased, although it doesn't use data from future directly, it uses values, which are derived from future data, i.e. the "real" $\mu$ wasn't known in earlier periods. The correct approach, to avoid look-ahead bias, would be to calculate $\mu$ for period $\delta$ as $\mu_\delta = 1/\delta \sum_{t=0}^{\delta} X_t$, which only uses data which is known up to this time-point.

We avoid this fallacy at the programming level by using a backtest design in which the models can  access the data over a specific interface, and which does not allow to query data from the future.

\paragraph{Time-period bias}

Time-period bias occurs when a specific model or characteristic wants to be shown and the tested time period was chosen, for which this specific characteristic was present (\cite{defusco2015quantitative}). Usually this bias is reduced by using longer time frames to conduct the experiments.

Although there is no fool-proof way to completely avoid this fallacy, we try to minimize it by using a long time period to conduct our experiments (25 years of data).

\paragraph{Data snooping bias}

Data-snooping bias (\cite{head2015phack}, also called p-hacking) is conducting several statistical tests on a single dataset and then reporting the false positives as statistically significant. For example if we statistically test the superiority of 100 models against some reference models with a significance level of $5\%$ we are expected to get 5 false positives by definition. \cite{head2015phack} talks about publication pressure and incentives to publish statistically significant results. There is evidence, that journals are more likely to publish results that look significant. However, the paper also concludes that, while false positives can be sticky because positive studies receive more attention and p-hacking is very common in literature, its overall effect on the scientific progress is relatively weak.

We try to avoid this fallacy by reporting the detailed results of all conducted experiments.

## Summary

In the first two sections of this chapter we first introduced the Mean/Variance framework, originally introduced by Markowitz, and discussed how an investor can build an efficient portfolio. We then introduced the Bayesian based portfolio formulation, which is an alternative approach to the portfolio selection problem. We also showed, how the Bayesian framework can be used in the Mean/Variance optimization setting. We then looked into the theory of utility. We introduced the CRRA utility function and then looked into the SQP-method for direct expected utility maximization, which is an alternative to the Mean/Variance optimization framework, by directly optimizing investors utility. In the last part we looked into some common pitfalls of backtesting.


To summarize, in this chapter we built the basis for the different approaches to portfolio optimization used in the case study in the practical part of this thesis. In the next chapter we build the theoretical foundation of Bayesian methods and Markov chain Monte Carlo.


# Bayesian statistics and Markov Chain Monte Carlo

We begin this chapter, by showing how the Bayesian theorem (Bayesian formula) is derived, then we take a dive into the concept of Bayesian inference and how it is used to make conclusions using the so called a-posteriori distribution.

We proceed to methods and algorithms to numerically solve the Bayesian inference problem. We will begin by introducing Monte Carlo methods in general and how the use Random Number Generators to answer specific questions. We then proceed to the ideas of Markov Chain Monte Carlo and take a detailed look at two specific MCMC algorithms, namely Metropolis-Hastings and Hamilton Monte Carlo.

In the last section we introduce probabilistic programming languages (PPL), and in particular Stan which is one instance of such a PPL. PPL provide a domain specific language for doing Bayesian inference using MCMC in a declarative and user friendly way.

We use the notation $\mathbf{x}$ (bold) to denote a stochastic variable, vector or matrix, as opposed to $x$ which is an ordinary scalar, vector or matrix.

## The Bayesian theorem and Bayesian inference


The goal of Bayesian inference is to make conclusions on a parameter $\boldsymbol{\mathbf{\Theta}}$ of the model based on observed, fixed data $X$. In the Bayesian world all parameters are random variables. We are usually interested in the so called a-posteriori density function of the parameters conditioned on the observed data $p_{\boldsymbol{\mathbf{\Theta \: \vert \: X}}}(\Theta \: \vert \: x)$, which incorporates all knowledge about the parameters $\boldsymbol{\mathbf{\Theta}}$ after seeing the data, in particular it tells us, how "probable" each of the possible parameter assignments $\boldsymbol{\mathbf{\Theta}}$ is. The a-posteriori distribution can be calculated with the Bayesian theorem after defining the likelihood $p(X \: \vert \: \Theta)$, and $p(\Theta)$ the a-priori distribution of $\boldsymbol{\mathbf{\Theta}}$.

The Bayesian theorem (Bayesian formula) directly follows from the definitions of conditional probabilities and the law of total probability (\cite{gelman2014bayesian}) and is defined for two continuous random variables $\boldsymbol{\mathbf{X}}$ and $\boldsymbol{\mathbf{\Theta}}$ as:

\begin{equation} 
p(\Theta \: \vert \: X) &=  \frac{p(\Theta, x)}{p(X)} \\
 &=  \frac{p(X \: \vert \: \Theta) \cdot p(\Theta)}{p(X)} \\
 &= \frac{p(X \: \vert \: \Theta) \cdot p(\Theta)}{\int_{\Theta} p(X \: \vert \: \Theta) \cdot p(\Theta) \; d\Theta}
\end{equation}

$p(X \: \vert \: \Theta)$ is the likelihood, defining the probability density of the dataset $\boldsymbol{\mathbf{X}}$, given one particular assignment of the parameter vector $\boldsymbol{\mathbf{\Theta}}$.

$p(\Theta)$ is the a-priori distribution of $\boldsymbol{\mathbf{\Theta}}$ and this distribution includes everything that we know about the parameter a-priori the inference, i.e. before we observe the data. A-priori distribution can be \textit{non-informative}, which can be interpreted as a distribution, which expresses no particular subjective believe about the distribution of $\boldsymbol{\mathbf{\Theta}}$, although there is no commonly agreed definition of what non-informative prior is and how it should be constructed. The principle of insufficient reason, originally formulated by Bernoulli and Laplace, \cite{sinn1980rehabilitation}, says that, if you know nothing about $\boldsymbol{\mathbf{\Theta}}$ you should use a probability which assigns equal probability for every possible outcome, i.e. a uniform distribution. This seems an obvious choice, but the use of uniform priors is often problematic because it is improper when using an unbounded parameter space in $\boldsymbol{\mathbf{\Theta}}$ (\cite{syversveen1998noninformative}). An improper prior doesn't integrate to one, this might or might not be a problem, in some cases the posterior is proper anyways.


As we can see the choice of non-informative priors is not straightforward, often the prior is chosen based on the principles of information theory. One choice is to use a prior distribution which maximizes the entropy, and therefore minimizes the embedded information in the distribution based on some constraints of the parameter space (\cite{shore1980axiomatic}). This is called the principle of maximum entropy (Maxent), for example the probability distribution which maximizes the entropy for the parameter space $(0, \infty)$, with the constraint that the expected value $\mathbb{E}(\boldsymbol{\mathbf{\Theta}})$ must exist, is the exponential distribution, in contrast, if we relax the constraint and say the expected value doesn't have to exist, the Maxent distribution would be the unbounded uniform distribution (\cite{conrad2013probability}).

Another popular choice is to use Jeffrey's prior (\cite{jeffreys1946invariant}) which chooses a prior such that $p(\Theta) \propto \sqrt{\operatorname{det} \mathbb{I}(\Theta)}$, where $\mathbb{I(\cdot)}$ is the Fisher information, which also is a measure of the amount of information of an random variable.

For practical reasons, often prior distributions are chosen, which make the Bayesian formula analytically tractable. This is done using so called conjugate families (\cite{bernardo1994bayesian}). An a-priori distribution is chosen (the conjugate prior), so that the a-posteriori distribution has the same "structure" (distribution family) as the a-priori distribution, and therefore making to solve the Bayesian formula convenient. When using a Hamilton Monte Carlo algorithm, analytical tractability is no issue, so the a-priori distribution can be chosen which best represents the a-priori knowledge, whether it is analytically tractable or not.

% ----------------------------------------------------------------------------------

## Monte Carlo methods and Random Number Generators

Monte Carlo methods are a broad base of numerical algorithms, which use repeated random sampling using random number generators (RNG's) to answer specific mathematical questions, that would otherwise hard or even impossible to answer using plain analytical derivations. Monte Carlo methods were pioneered by Enrico Fermi, Stanislaw Ulam and John Von Neumann in the 1930's and 1940's and are used extensively in many scientific fields, including Finance, Physics, Chemistry and Medicine, since then.

Since Monte Carlo algorithms rely on random numbers, in this section we talk about different ways to generate random numbers, and in particular how a computer as a deterministic device generates random numbers (\cite{shonkwiler2009explorations}).

In the beginning we must distinguish between "real" random numbers, which are created by a nondeterministic source, and pseudo random numbers, which are created by deterministic devices and try to "mimic" real random sequences.

Real random numbers are generated by measuring properties of nondeterministic physical processes. Examples of such physical random generators are measuring radioactive decay or measuring noise of a sensor. These processes are all well known to be nondeterministic.

A computer is a deterministic device, which means that for a given fixed input it always produces the same results, and therefore has no stochastic (random) components in itself, it is, by definition, impossible to generate real random numbers within a computer without using external sources of randomness (e.g. user input or physical randomness sources). Real random number generators are usually not available on consumer hardware without using special devices, e.g. a USB device which measures random noise, but since only some properties of real random numbers are wanted, in practice pseudo random number generators are used to simulate the behavior of real random numbers.

For Monte Carlo algorithms, 
the non-deterministic component is often unwanted, for example when the reproducibility of experiments is required. This is usually accomplished by providing the {\it seed} value, which is the initialization number of the pseudo random number generator. Given the seed number, the sequence of numbers which is generated by a pseudo random number generator is completely predictable when the RNG algorithm is known. This is usually not an issue when using Monte Carlo for numerical simulation, but it is unwanted when using RNG's for cryptographic applications, for example encryption. In this case the seed value used is usually a number which is hard to predict, for example the current time or the nanoseconds since the computer started up. 

Pseudo random number generators usually generate $U(0, 1)$ random numbers, i.e. a sequence which is distributed uniformly in the interval $[0, 1]$. The inversion method \cite{devroye1986general} allows us to generate sequences of any probability distribution if we know the quantile function $F^{-1}$, which is the inverse of the cumulative distribution function.

Let $F$ be a right-continuous cumulative distribution function on $\mathbb{R}$ and quantile function $F^{-1}$ with $F^{-1}(p) = \inf \Big\{ x \; : \; F(x) = p, 0 < p < 1 \Big\}$. If $\boldsymbol{\mathbf{u}}$ is a random variable with $U(0, 1)$ distribution, then $F^{-1}(\boldsymbol{\mathbf{u}})$ has cumulative distribution function $F$ (Inversion method):
$$
P(F^{-1}(\boldsymbol{\mathbf{u}}) \le x) = P(\inf \{ y \; : \; F(y) = \boldsymbol{\mathbf{u}}\} \le x)\\
= P(\boldsymbol{\mathbf{u}} \le F(x))\\
= F(x)
$$

\begin{example}[Generation of exponential distributed random variables]


The exponential cumulative distribution function is defined as $F(x) = 1 - e^{\lambda x}$, for $x \ge 0$. We calculate the inverse of the cumulative distribution function $F^{-1}(p) = \frac{-\ln(1 - p)}{\lambda}$. In this example we generate $N = 10000$ samples of $U(0, 1)$ distributed numbers using the R function {\it runif}, and then plug the numbers in the quantile function $X = F^{-1}(U)$, which should result in exponential distributed numbers. To check the results the histogram of the samples $U$ and $X$ and the theoretical density functions (red line), as well as the empirical cumulative density function of $X$ and the theoretical cumulative density function (red dashed line), are plotted. As expected, $X$ is exponential distributed.  In this example we set $\lambda = 5$.

% inversion-method.R
\begin{lstlisting}
N = 10000
lambda = 5

U = runif(N, min = 0, max = 1)
X = -log(1 - U) / lambda
\end{lstlisting}


\begin{figure}[H]
\includegraphics[scale=0.5]{img/inversion-method-example.pdf}
 \caption{Example \ref{ex:inversion-method}: Histogram of samples U and X, Empirical CDF of X, red lines are the theoretical functions}
 
\end{figure}

\end{example}

### Monte Carlo integration

One instance of a Monte Carlo based algorithm is Monte Carlo integration.

Suppose we can obtain identically and independently distributed (i.i.d.) samples $x^{(i)}$ from some random variable $\boldsymbol{\mathbf{x}}$ with density $p(x)$, then we can use the arithmetic average of the function of the samples to approximate a definite integral over the density function and some function $f$ using the strong law of large numbers \citep{jordan2010sampling,andrieu2003introduction}. The arithmetic average converges almost surely (a.s., which means with probability 1) to the definite integral, as the number of samples $N$ goes to infinity:
$$
\frac{1}{N} \sum_{i=1}^N f(x^{(i)}) \; {\xrightarrow {\text{a.s.}}}\ \int_{x \in X} f(x) \; p(x)  dx \qquad {\textrm {when}}\ N\to \infty 
$$

We can use this form to approximate e.g. the expected value $\mathbb{E}(\boldsymbol{\mathbf{x}})$ using $f(x) = x$, or the variance $Var(\boldsymbol{\mathbf{x}})$ using $f(x) = (x - \mathbb{E}(x))^2$. 

The rate of convergence of the arithmetic average is proportional to $\sqrt{N}$ but this proportionality constant increases exponentially with the dimension of the integral \citep{jordan2010sampling}.

As said, for this method we have to be able to directly sample from $\boldsymbol{\mathbf{x}}$, however for Bayesian inference, we cannot obtain independent samples from the a-posteriori distribution in the general case, because this involves solving the Bayesian formula, which could be very hard or even intractable. 

There are other Monte Carlo methods, such as Rejection sampling or Importance sampling, which allow to sample from $\boldsymbol{\mathbf{x}}$ using a proposal distribution which is similar to $p(x)$ but easier to sample from. However easy-to-sample from proposal distributions may be impossible to obtain (\cite{andrieu2003introduction}), or the samples suffer from high variance in higher dimensions (\cite{andrieu2003introduction}).

In the next section we are going to explore a different idea, by sampling not independent, but slightly dependent samples from $\boldsymbol{\mathbf{x}}$ using Markov Chains.

## Markov Chain Monte Carlo

In the last section we mentioned Monte Carlo algorithms, which can generate independent samples from some random variable $\boldsymbol{\mathbf{x}}$. However we also noted, that when using these methods, the variance of the samples increases greatly in higher dimensions. 

Markov Chain Monte Carlo is a different strategy for generating samples from some random variable $\boldsymbol{\mathbf{x}}$. Instead of obtaining independent samples, a MCMC procedure generates samples dependent on the last step.

We introduce the Markov chain theory according to \cite{andrieu2003introduction}, \cite{jordan2010sampling} and \cite{chang2007processes} and using finite state spaces, i.e. $\boldsymbol{\mathbf{x}}$ can only take discrete values.

**Markov chain** A sequence $\boldsymbol{\mathbf{x^{(i)}}}$ of random variables is called a Markov chain if it holds the Markov property:
$$
p(x^{(i)} \: \vert \: x^{(i-1)}, ..., x^{(1)}) = p(x^{(i)} \: \vert \: x^{(i-1)}) = T(x^{(i)} \: \vert \: x^{(i-1)})
$$
To specify a Markov chain (\cite{chang2007processes}), a state space $\mathbb{S} \in \{1, 2, ..., M\}, \boldsymbol{\mathbf{x^{(i)}}} \in \mathbb{S}$, an initial probability distribution for $\boldsymbol{\mathbf{x^{(0)}}} \sim p_0(x^{(0)})$ and a probability transition function $T(\boldsymbol{\mathbf{x^{(i)}}} = x \: \vert \: \boldsymbol{\mathbf{x^{(i-1)}}} = x')$ is needed. If the state space is finite, one can specify a matrix $P \in \lbrack 0, 1 \rbrack^{M \times M}$, where $P_{rc} = T(\boldsymbol{\mathbf{x^{(i)}}} = x_c \: \vert \: \boldsymbol{\mathbf{x^{(i-1)}}} = x_r)$, i.e. each row $r$ defines the current state and each column defines the probability going to the the state $c$ conditional on being on the row $r$. Each row must, of course, sum to one.

\begin{example}[Example Markov chain specification] 
We define a Markov chain with state space $\mathbb{S} = \{A, B, C\}$, starting point $p_0 = A$ and transition matrix 
$$P = \begin{pmatrix}
  0 	& 0.2	& 0.8  \\
  0		& 0.5	& 0.5	\\
  1		& 0		& 0	
 \end{pmatrix}$$

In Figure \ref{fig:markov-chain-ex} we can see a graphical representation of the Markov chains, where the circles represent the states and edges represent the transition probabilities. In this example, the initial state is $A$ then the probability of going from state $A$ to $B$ is $P_{12} = 0.2$ and going to state $C$ is $P_{13} = 0.8$.

\begin{figure}[H]
\includegraphics[scale=0.5]{img/markov-chain.pdf}
\caption{Experiment \ref{ex:markov-chain}: Graphical representation of the Markov chain specified in the example}

\end{figure}
\end{example}

**Markov chains for MCMC** For MCMC, one chooses the transitions for the Markov chain, such that the target distribution $p(x)$ is invariant for the Markov chain (also called stationary distribution or equilibrium distribution of the Markov chain):
$$
p(x) = \sum_{x'} T(x \: \vert \: x') \; p(x')
$$

A sufficient, but not necessary condition to show that a particular $p(x)$ is the invariant distribution, is the detailed balance condition (also called reversibility condition):
$$
p(x') \; T(x \: \vert \: x') = p(x) \; T(x' \: \vert \: x)
$$

The sufficiency of this condition can easily be seen by summing both sides with all possible values for $x$\footnote{Note: $\sum_{x'} T(x' \: \vert \: x) = 1$, because all outgoing transition probabilities must, of course, sum to 1}:
$$
\sum_{x'} p(x') \; T(x \: \vert \: x') = \sum_{x'} p(x) \; T(x' \: \vert \: x) = p(x)
$$

Another important property of the Markov Chain for MCMC is, that one chooses the transitions as such, that they eventually converge to the chosen invariant distribution $p(x)$. This is true if the transition function holds the following properties:

**Irreducibility** For every possible state of the Markov chain, there is positive probability of visiting all other states:
$$
\forall x_0, x_1 \in \mathbb{S}: \sum_{i=0}^{\infty} P(X_i=x_1 \: \vert \: X_0 = x_0) > 0
$$

**Aperiodicity** The chain cannot get trapped in cycles: An irreducible Markov chain is defined as aperiodic, if its period\footnote{Given a Markov chain $\boldsymbol{\mathbf{x^{(i)}}}$ with transition matrix $P$, the period $d_i$ of state $i$ is defined as $d_i = gcd\{ n: P^n_{ii} > 0 \}$, where gcd\{x\} is the greatest common divisor of set $x$}\footnote{All states in an irreducible Markov chain have the same period} is 1.

When we construct a Markov chain with these two properties we have an asymptotic guarantee, that the individual distributions of each $\boldsymbol{\mathbf{x^{(i)}}}$, which are dependent on $i$ eventually converge to the invariant distribution. 

Let $\boldsymbol{\mathbf{x^{(0)}}}, \boldsymbol{\mathbf{x^{(1)}}}, ...$ be a Markov chain with invariant distribution $p(x)$ which is irreducible and aperiodic, then for all initial distributions $p_0$ of $\boldsymbol{\mathbf{x^{(0)}}}$ (i.e. starting points) holds (Basic limit theorem of Markov chains, \cite{chang2007processes}):
$$
\lim_{i \to \infty} p_i(x) = p(x)
$$

#### Summary

In this section, we introduced the Markov chain theory as the basis for all MCMC algorithms, and specifically which properties of a Markov chain are important for MCMC. 

A MCMC sampling algorithm constructs a Markov chain which has a specific target distribution as the invariant distribution. In case of Bayesian inference the target distribution is the a-posteriori density distribution of a Bayesian model. We can use the detailed balance condition to show, that the target distribution is the invariant distribution. 

It is also of interest, to show if an Markov chain converges to this invariant distribution independent of the starting point. We can use irreducibility and aperiodicity conditions to show that the chain eventually converges to the target distribution. When using MCMC in practice, there are measures, for example R-hat the possible scale reduction factor (see Section \ref{sec:rhat}), to check whether a chain has converged to the stationary distribution or not.

In the next sections, we are going to introduce the actual MCMC algorithms, which are methods to construct Markov chains with such properties.

## Metropolis-Hastings algorithm


The Metropolis-Hastings algorithm, introduced by \cite{metropolis1953equation} and further generalized by \cite{hastings1970monte} is one of the simplest and easiest to understand MCMC algorithms.

As said, the goal a MCMC algorithm is now to construct a Markov chain, whose invariant distribution is the distribution of interest, i.e. we want to "walk through" (to sample from) the parameter space in proportion to the target distribution $p_{\boldsymbol{\mathbf{\pi}}}(x)$ (which is usually the a-posteriori density of a Bayesian model in the case of Bayesian inference $p_{\boldsymbol{\mathbf{\pi}}}(x) = p(\Theta \: \vert \: X)$).

The algorithm works by first choosing a candidate point $x'$ randomly sampled from a proposal distribution (also called jumping rule) $\boldsymbol{\mathbf{\boldsymbol{\mathbf{q \: \vert \: x^{(i)}}}}}$. This distribution is not fixed and is conditional on the current point in the chain. Usually a proposal distribution is chosen whose expectation is the current point $\mathbb{E} (\boldsymbol{\mathbf{q \: \vert \: x^{(i)}}}) = x^{(i)}$, although this is not required.  A number $c$ is sampled from a $U(0, 1)$ distribution. If $c > \alpha(x^{(i)}, x')$ the candidate point is accepted setting $x^{(i+1)} := x'$ otherwise the chain does not move and stays at its current position $x^{(i+1)} := x^{(i)}$. The function $\alpha$, which defines the candidate point acceptance is only dependent on the current point in the chain and is given by

$$\alpha(x, y) = \min \Big( 1, \frac{p_{\boldsymbol{\mathbf{\pi}}}(y) \; p_{\boldsymbol{\mathbf{q \: \vert \: x^{(i)}}}}(x \: \vert \: y)}{p_{\boldsymbol{\mathbf{\pi}}}(x) \; p_{\boldsymbol{\mathbf{q \: \vert \: x^{(i)}}}}(y \: \vert \: x)} \Big)$$

\begin{lstlisting}[escapechar=|, caption={Metropolis-Hastings Algorithm}]
|$x^{(1)}$| = |$x^{(start)}$|

for i in 1:N
  |$x'$| = sample from |$\boldsymbol{\mathbf{q \: \vert \: x^{(i)}}}$|
  |$c$| = sample from |$U(0, 1)$|
  a = |$\alpha(x^{(i)}, x')$|

  if a > c:
  	|$x^{(i+1)}$| = |$x'$|
  else
  	|$x^{(i+1)}$| = |$x^{(i)}$|
  end
end 

output |$x^{(1)}$|, ..., |$x^{(i)}$|
\end{lstlisting}

A discussion of the proof of the Metropolis-Hastings can be found in Appendix \ref{proof:metro}.


#### Choosing a proposal distribution

The choice of the right proposal distribution is not straightforward, since the acceptance probability of the candidate depends on the proposed point. When we consider a proposal distribution with high variance, it will quickly converge to the target distribution since it makes large steps, however when converged the acceptance probability will not be high since it often makes proposals which are in the tail of the target distribution making $p_{\boldsymbol{\mathbf{\pi}}}(x')/p_{\boldsymbol{\mathbf{\pi}}}(x^{(i)})$, and therefore the acceptance probability small. In contrast when the variance of proposal distribution is small, we have the exact opposite problem, making the convergence slow when starting at a point way out of the high density interval of the target distribution, but having a high acceptance probability.

\begin{example}[The Metropolis-Hastings algorithm and different proposal distributions]


We have a dataset of $I=20$ data points $X_i$, $i = 1 ... I$ and we know the data points to be independently and identically normal distributed with unknown mean and known $\sigma_{real} = 0.2$. We want to infer the probability density of the mean $\boldsymbol{\mathbf{\mu}}$ using the Metropolis algorithm. Since we only want to infer the mean we have a one dimensional parameter space. In this example we assume we know that the parameter lies in the interval $\left[ -10, 10 \right]$ so we choose a uniform prior $U(-10, 10)$, for which the probability density is given by $p(\mu) = \frac{1}{20}$ for $-10 \leq \mu \leq 10$ and $p(\mu) = 0$ otherwise. In this example we generate the dataset by sampling 20 values from a normal distribution with $\mu_{real} = 0.4$ and $\sigma_{real} = 0.2$.

The Gaussian likelihood, defining the probability density of the dataset $\boldsymbol{\mathbf{X}}$, given one particular assignment of the parameter vector $\boldsymbol{\mathbf{\Theta}}$, is in this case given by the product of the likelihood of the individual data points, since we assume they are independent $p(X \: \vert \: \mu) = \prod_{i = 1}^{N} p_\text{norm}(X_i \: \vert \: \mu, \sigma)$, where $p_\text{norm}$ is the Gaussian probability density function.

To calculate the a-posteriori distribution of the mean parameter, we can use the Bayesian formula, and since we use a MCMC algorithm we only need to specify a function which is proportional to the posterior, i.e. the a-priori distribution times the likelihood:

$$p(\mu \: \vert \: X) = \frac{p(X \: \vert \: \mu)  \; p(\mu)}{\int_{\mu \in M} p(X \: \vert \: \mu)  \; p(\mu)  \; d\mu} \propto p(X \: \vert \: \mu) \; p(\mu)$$

We run the experiment three times with 2000 steps, using different Gaussian-distributed proposals with $\sigma=0.01$,  $\sigma=0.1$ and $\sigma=0.4$.

\begin{figure}[H]
\includegraphics[scale=0.5]{img/proposal_distributions.pdf}
\caption{Experiment \ref{ex:metropolis-proposal}: Three different runs of the Metropolis-Hastings algorithm using Gaussian-distributed proposals with $\sigma=0.01$ (top),  $\sigma=0.1$ (middle) and $\sigma=0.4$ (bottom). The different proposal distributions lead to different paths in the random walk and different acceptance rates (left, trace plot of the random walk) and different autocorrelations in the random walk (right, ACF plot for the random walk)}

\end{figure}

As we can see, a low standard deviation in the proposal distribution leads to a high acceptance rate, since the proposed points lie in the area with a high acceptance probability. However the points are highly autocorrelated which leads to a lower effective sample size (see Section \ref{p:ess}). A higher standard deviation in the proposal distribution leads to a smaller acceptance probability but also to a lower autocorrelation.

Since the random walk samples represent the a-posteriori distribution, which is in our case the a-posteriori distribution for the $\mu$ parameter, we can further analyze the samples, e.g. calculating the mean, or the posterior interval. The $100 (1-\alpha)\%$ posterior interval corresponds to the range of values above and below in which lies $100 (\frac{\alpha}{2}) \%$ of the posterior probability \citep{gelman2014bayesian}. 
We calculate the a-posteriori mean using the empirical mean of the random walk samples, and the 95\% posterior interval (PI) using the 5\% quantile and the 95\% quantile of the obtained samples (i.e. ordering all values and taking the 5\%/95\% smallest value). Table \ref{tbl:res-mp} shows the results of the experiment.

\begin{table}[ht]
\centering
\begin{tabular}{|r|l|r|l|}
  \hline
& $\sigma$ & mean & 95\% PI\\ 
  \hline
1 & 0.01 & 0.434 & [0.371, 0.497] \\ \hline 
  2 & 0.1 & 0.436 & [0.367, 0.514] \\ \hline
  3 & 0.4 & 0.440 & [0.380, 0.510] \\ 
   \hline
\end{tabular}
\caption{Example \ref{ex:metropolis-proposal}: Results of the three experiments: $\sigma$ of the proposal distribution, Empirical average and the 95\% posterior interval of the a-posteriori parameter $\boldsymbol{\mathbf{\mu \: \vert \: X}}$}

\end{table}

As we increase the step size or tweak the proposal distribution of the metropolis algorithm, the samples should better represent the "real" a-posteriori distribution (but not necessary making the posterior interval smaller). 

The R-Code for this example can be found in Appendix \ref{file:metropolis}.

\end{example}

## Hamilton Monte Carlo


One major flaw, characterizing all Metropolis-Hastings-based methods, is the inefficiency in models with many parameters (i.e. a high-dimensional target distribution), needing a long time to discover the whole space of interest in their random walk (\cite{gelman2014bayesian}). There are ways around this unwanted inefficiency, such as re-parameterization or more appropriate jumping distributions (exploring the target function with a higher acceptance rate), however this workarounds are often model specific. 

In contrast **Hamilton Monte Carlo (HMC, also called Hybrid Monte Carlo)** uses a different idea by introducing an auxiliary momentum variable for each parameter to suppress this unwanted random walk behavior. Hamilton Monte Carlo was introduced by \cite{duane1987hybrid} and this section is mainly based on the explanations provided by \cite{gelman2014bayesian}, \cite{stanmanual} and \cite{hoffman2011no}.

\paragraph{Intuition}

First we want to give a little intuition about how the HMC algorithm works, and how it is in many cases more efficient compared to the Metropolis algorithm. Image we have a one-dimensional target function with one mode (like the Gaussian density function), and the most recent step in the sampling process was in the left tail. Since we are using MCMC the next step will be dependent on the step before (Markov property), and ideally the next step would be to the high density region (i.e. somewhere in the middle). So now lets look how the next step proposal differs between the two algorithms. 

Using the Metropolis-Hastings-Algorithm, we are using a conditional proposal distribution centered on position of the last step, with some arbitrary, pre-chosen standard deviation. The proposal is a random relative step to the left or right\footnote{unless the proposal distribution function is specifically tuned} (see Section \ref{sec:metropolis}). When a step to the left is chosen, the proposal is likely to be rejected (because the density in the target function at a more left point is lower). Since the proposal distribution doesn't incorporate the shape of the target function, this is called a random walk, and thus leading to a high rejection rate, which is inefficient, because more steps are needed.

Now lets look how the HMC algorithm chooses the next step proposal. HMC uses, as the name suggests, Hamilton dynamics, which is a concept from theoretical physics, to avoid the random walk behavior of the Metropolis-Hastings algorithm. Hamilton dynamics fully describes a physical system in terms position and momentum vectors plus some equations on how these vectors change over time. The important part here is, that the whole dynamics only describe an exchange between kinetic energy and potential energy, where the energies are a function of the position and momentum vectors, but the total energy will always be constant. One could image a (frictionless) swinging pendulum, where at the highest points the kinetic energy is zero and the whole energy is in the potential part, and on the lowest point, in the middle, where the whole energy of the system is in the kinetic part. 

In simple terms, in HMC, the last step is taken as the position, then some random momentum is chosen, and the potential energy is set to be proportional to the negative density of the target function at this position. Then the Hamiltonian system is simulated for some amount of time, and  the resulting position is taken as the next proposal step. The important part here is the choice of the potential energy function: When we continue the thought experiment from above, having a Gaussian target function, one could image a marble which is placed on the left side of a U-shaped curve (i.e. turning the target function upside-down), where the curve here acts as a analogous to the potential energy function. We  push the marble in a random direction, and then take the marble position after one second as the next proposal step. As one can image a marble in a U-shaped curve, if we push the marble in some random direction, after some time, gravity will force the marble back to the middle, and also regions with high potential energies (the sides) require stronger pushes. Back to MCMC, when we imagine the marbles position at some time point as the proposed steps, this behavior is exactly what we want, proposing more positions in low potential energy regions (and thus high density regions), leading to a higher acceptance rate. 

\paragraph{Description of the Algorithm}

Again, our goal is to sample from a target distribution function $p_{\boldsymbol{\mathbf{\pi}}}(x)$ (which is usually the a-posteriori density $p(\Theta \: \vert \: X)$). 

As said, the HMC algorithm uses a special auxiliary momentum variable called $\rho$, which is of the same dimension as $\boldsymbol{\mathbf{\Theta}}$ (i.e. for each parameter in the target function, there is a corresponding momentum value). A zero-mean multivariate Gaussian distribution, which is independent from the parameters $\boldsymbol{\mathbf{\Theta}}$, is assigned to $\boldsymbol{\mathbf{\rho}}$ such that $\boldsymbol{\mathbf{\rho}} \sim MultiNormal(0, \Sigma)$, and a new joint density function is defined as $p(\Theta, \rho) = p(\Theta) \cdot p(\rho)$. \footnote{This is the most common setup for $\boldsymbol{\mathbf{\rho}}$ and also used by Stan, variants using other distributions for $\boldsymbol{\mathbf{\rho}}$ may exist}. $\Sigma$ is used to tune the performance of the integrator (see below).

Using a concept from statistical mechanics called canonical distributions (\cite{brooks2011handbook}) allows us to relate a random variable to a energy function by taking the negative logarithm of the density function. Using this canonical distribution, the joint density function now defines the Hamiltonian, describing the total energy of the system, as the sum of the kinetic energy $T(\rho)$ and potential energy $V(\Theta)$:

$$
  H(\rho, \Theta) = T(\rho) + V(\Theta) = -\log p(\rho) -\log p(\Theta)
$$

Using the Hamiltonian equations, which describe the dynamics of the position and momentum vector, we can now derive the behavior of our system:

$$
\frac{d\Theta}{dt} = \frac{\partial H}{\partial \rho} = \frac{\partial T}{\partial \rho} \\
\frac{d\rho}{dt} = - \frac{\partial H}{\partial \Theta} = - \frac{\partial V}{\partial \Theta}
$$

We are now left with two differential equations which must be discretized in order to be simulatable by a computer. Discretization works by dividing the system into a subset of small discrete time points and iteratively approximating the state for each time step, while ideally keeping the discretization error as small as possible.

The leapfrog algorithm is such an advanced discretization method, which is specifically tuned for the Hamiltonian equation system and it preserves the reversibility and volume preservation properties of the Hamilton system in the discretization step, which is important for the theoretical implications of the resulting Markov Chain. 

The leapfrog method is started by choosing a time interval (also called step-size) $\epsilon$, which sets the discretization step-size when advancing the system using the derived dynamics of the Hamiltonian system. The leapfrog algorithm works by taking a half step on the momentum, a full step on the position, and finally a half step on the momentum, which results in a total step by $\epsilon$ for both variables \citep[for a detailed discussion of the leapfrog algorithm see][]{gelman2014bayesian}:

$$
\rho = \rho - \frac{\epsilon}{2}\frac{\partial V}{\partial \Theta}\\
\Theta = \Theta + \epsilon \frac{\partial T}{\partial \rho} = \Theta + \epsilon \; \Sigma \; \rho\\
\rho = \rho - \frac{\epsilon}{2}\frac{\partial V}{\partial \Theta}
$$

After the leapfrog method has done an pre-chosen amount of steps, in the last step of the HMC algorithm a Metropolis-Hastings acceptance step is performed. This is only required because of discretization discrepancy compared to the real dynamics. The proposed step can be rejected, when the total energy of the new state is higher than the total energy of the old state:

$$
P(\text{accept proposed step } \Theta') = \min(1, e^{H(\rho^{(i)}, \Theta^{(i)}) - H(\rho', \Theta')})
$$


\begin{lstlisting}[escapechar=|, caption={Hamilton Monte Carlo Algorithm}]
input parameters:
  |$\Theta$|: starting position, vector of size S
  V(|$\Theta$|): potential energy function 
  dV(|$\Theta$|): gradient of the potential energy function
  |$\epsilon$|: Leapfrog step-size 
  L number: of Leapfrog steps to take
  N number: of samples

define kinetic energy function T(|$\rho$|) = |$\frac{1}{2} \sum_{i=1}^{S} \rho_i^2$|
P = vector of size N
for t in 1:N
  |$\rho$| = sample from S-dimensional Standard Multivariate Gaussian
  |$\Theta_{old}$| = |$\Theta$|; |$\rho_{old}$| = |$\rho$|
  
  simulate L Leapfrog steps with |$\rho$|, |$\Theta$|, using step size |$\epsilon$| and gradient dV(|$\Theta$|)

  |$p_{accept}$| = min(1, exp( (V(|$\Theta_{old}$|) + T(|$\rho_{old}$|)) - (V(|$\Theta$|) + T(|$\rho$|)) ))

  |$c$| = sample from |$U(0, 1)$|
  if |$p_{accept}$| > c:
    |$P^{(t)}$| = |$\Theta$|
  else
    |$P^{(t)}$| = |$\Theta$| = |$\Theta_{old}$| # rejected, continue on position |$\Theta_{old}$|
  end
end

output |$P^{(1)}$|, ...,|$P^{(t)}$|
\end{lstlisting}
\footnote{$\Sigma$ is assumed to be the identity matrix, so no correlation between the variables}

A proof that the Hamilton Monte Carlo algorithm produces a proper Markov Chain for MCMC can be found, for example, in \cite{brooks2011handbook}.

\paragraph{Discussion}

In this section we introduced the Hamilton Monte Carlo algorithms. The HMC algorithm is often more efficient in higher dimensions by avoiding the random walk behavior of the Metropolis-Hastings algorithm.

But the HMC is also not without problems in practice: we have to choose parameters of the algorithm, such as the step size and number of steps for leapfrog and also in practice the covariance matrix $\Sigma$ of $\boldsymbol{\mathbf{\rho}}$ has to be chosen to improve the performance of the algorithm. Also the gradient of the parameter vector in terms of the potential energy function has to be derived manually. 

In the next section we introduce the probabilistic programming language Stan which uses the NUTS algorithm, which attempt to solve some of the discussed caveats of the HMC algorithm.

## Probabilistic Programming Languages

Probabilistic programming languages (PPL) are programming languages define a domain specific language (DSL) for describing statistical models and doing inference on these models. For the inference task, they often use Markov chain Monte Carlo algorithms, although this is not required (e.g. Infer.NET a PPL framework for .NET languages uses a message-passing algorithm).

Advantages of using a PPL over a custom implemented algorithm is obviously its simplicity. With a PPL we are concentrating on the "what" task, i.e. we describe a statistical model using a custom language, which this is a more declarative approach. 
When implementing the algorithm manually, the model is already embedded within the algorithm, this follows a more imperative approach, concentrating on the "how" part. Of course, a custom algorithm provides the most flexibility but often this flexibility is not needed, and other aspects such as ease of use and verifiability are more important, which favors a PPL approach.

## Stan

We decided to use Stan as the PPL for this thesis, so in this section we will give a kind introduction and then will further introduce the features of Stan and the structure of a Stan program.

The Stan project was initially started by Gelman and Hill (\cite{stanmanual}) after discovering shortcomings with BUGS (\cite{lunn2000winbugs}) and JAGS (\cite{hornik2003jags}), which are probabilistic programming languages based on Gibbs sampling, a Metropolis-Hasting based approach, when they wanted to fit a multilevel generalized linear model in their paper \cite{gelman2007data}. At this time they got more involved into the Hamiltonian Monte Carlo algorithm which was able to overcome the shortcomings of Metropolis-Hasting based approaches (see Section \ref{sec:hmc}). Since then, the Stan project evolved continuously and has now developed a strong community and users from many different fields. 

### The NUTS algorithm

Stan uses the Hamiltonian Monte Carlo algorithm or in particular a modification of the HMC algorithm called NUTS, the No-U-turn sampler. In \cite{hoffman2011no} they propose a method to automatically determine the two parameters of the HMC algorithm, namely the step size and the desired number of steps, which they called the No-U-Turn sampler. To set the number of steps, the method uses a recursive procedure to build a list of possible trajectories along the target distribution while avoiding retracing ("no U-turns"). They show that this procedure of choosing the number of steps performs at least as efficient as manually tuning the parameter. The step size is optimized using a optimization method called "primal-dual averaging", and therefore the NUTS algorithm needs no manual parameter input at all, which makes it very suitable for use in a computing environment like Stan.

### Reverse-mode algorithmic differentiation

One disadvantage when choosing the HMC algorithm in favor of the Metropolis-Hastings approach, is that the HMC algorithm needs gradient information (i.e. the first derivatives of all parameters of the target distribution). In general, manually deriving the gradient is no problem, however it can be quite cumbersome, error prone and also time intensive, especially when used in a computing environment like Stan, in which the user focuses on the modeling part rather than on the technical details of the underlying algorithms. 

Stan uses a method which is able to automatically derive the required gradients of the target distribution called reverse-mode algorithmic differentiation, avoiding these manual steps. In this paragraph, which give a brief overview of how this algorithm works.

Reverse-mode algorithmic differentiation (short Reverse-mode AD, also called automatic differentiation, \cite{carpenter2015stan}) is an algorithm which computes the value of the gradient of a function $f$ automatically. Automatic differentiation, unlike numerical derivation methods such as finite differencing, is exact (up to the machine precision). Also Automatic differentiation may not be confused with Automatic Symbolic differentiation, as used for example in Mathematica, whose output is the entire symbolic derivative function expression whereas algorithmic differentiation only outputs the values for the derivative. Although Automatic Symbolic differentiation has its place for certain applications (e.g. when a symbolic expression for a derivative is needed, for example in a Computer Algebra System), it has also certain difficulties (see \cite{carpenter2015stan}). It might seem, that Automatic Symbolic differentiation is more powerful, because it works with symbols, however the opposite is the case, in fact Automatic differentiation is more expressive in the sense that Automatic differentiation can be used to calculate the derivative not only of functions in the mathematical sense but also derivatives of computer programs which include loops, conditionals and function calls.

Algorithmic differentiation uses the meta-programming features of programming languages such as C++ (the Stan Reverse-mode algorithmic differentiation is implemented in C++) to transform the program or function of interest into an expression graph. This expression graph only consists of subexpressions, for which the derivatives are known (e.g. simple expressions like $a+b$ or functions like $sin(x)$) and then the chain rule $\frac{\partial f}{\partial x_i} = \sum_{j = 1}^N \frac{\partial f}{\partial u_j} \frac{\partial u_j}{\partial x_i}$ is used to calculate the derivative ($u_j$ in this case represent the subexpressions). First the subexpressions and all partial derivatives thereof are determined (called forward pass). In the following reverse pass, each subexpression is assigned a adjoint value, for the root node (the output value), the adjoint value is $1$ for all the others it is $0$. The expression graph is traversed, multiplying the adjoint values, which then represent the derivatives, and therefore after the pass, the adjoints of the input variables contain the gradients.

### The syntax of a Stan program

Stan is an imperative domain specific language (\cite{stanmanual}). Imperative means, it is possible to use imperative language constructs such as conditionals, loops and functions. Domain specific means, that a Stan program defines a program for a specific domain and is not meant for general purpose programming.

In a nutshell, a Stan program defines a conditional probability function $p(\Theta \: \vert \: X)$ using a specialized domain specific syntax, where $\boldsymbol{\mathbf{\Theta}}$ stands for the unknown parameters of the model and $X$ for the collection of all observed data.

Since the syntax of Stan is mostly based on ordinary programming languages we won't go into much detail onto how commonly known things like assignments or loops works, instead we only talk about the details, which aren't that common in other programming languages or behave different from what a typical user would expect. 

Stan is strongly and statically typed, every variable must have a declared type which cannot change. There are two primitive types \textit{real} for continuous variables and \textit{int} for integer values. Stan also provides data-types for Vectors (\textit{vector} and \textit{row\_vector}), matrices (\textit{matrix}), arrays (e.g. \textit{real xs[4]}, defines a array with name \textit{xs} of type \textit{real} and length 4) and specialized types, which are often used in statistical models (e.g. \textit{corr\_matrix} which defines a matrix which is positive definite, symmetric, unit diagonal and whose entries are between -1 and 1). 

Constraints for data types are also allowed in a Stan program (e.g. \textit{real\textless lower=0\textgreater  x}, defines a non negative real). For input parameters, the constraints provide a mechanism for error checking and for parameters the constraints provide implicit priors (see below).

As said, a Stan program defines a conditional probability function and when executed, the \text{model} block is executed once for each sample. The \text{model} block is so to say, the heart of a Stan program, which returns the conditional probability of the model. In Section \ref{ex:stan} we demonstrate the structure and syntax of an Stan program based on an example.

### Stan in practice

\paragraph{Interfacing with R}

In a practical application, Stan is used through an interface (\cite{stanmanual}). A Stan interface is used to control the compilation and the execution (i.e. the sampling) of a Stan program, through the interface the sampler also receives its input parameters and after the sampling process is finished, the output samples are also received through the interface.

In this thesis we concentrate on the R interface RStan, since R is our computing environment of choice, so all parameters will be fed in through R and also the post-run analysis is done with R.

\paragraph{Number of chains and startup}

Since the starting point of a MCMC simulation is random in the general case, the iterative simulation may take a number of samples to find the high probability space of the target distribution. Therefore early samples may not be representative for the target distribution and are usually discarded for further calculations. These initial samples are usually called warm-up or burn-in samples. 

There is no common agreed number, of how many initial samples should be discarded and that number also depends on the algorithm and the parameters. Gelman uses the general conservative practice of discarding the first of all samples.

Another parameter of a MCMC simulation is how many individual chains should be run. Each individual chain is independent and does one execution of the particular MCMC algorithm. At the end all samples obtained by the individual chains, after discarding the warm-up samples, are then collected into a common pool.

There is no common agreed number of how many chains should be used and if its better to run one very long or more but shorter chains. In practice often the number of chains is set to the number of CPU cores, since each chain is independent and can run on one core, and so the computing power is efficiently distributed.

\paragraph{Traceplot}

The traceplot is a plot of the sampled parameters against the iteration number. The traceplot shows us how the MCMC explored the parameter-space, and can be used to visually assess the convergence and mixing behavior of individual parameters.

\paragraph{Effective sample size}


By definition of the Markov property each sample obtained by the Markov chain is dependent on the value of the prior sample $x^{(i)} \: \vert \: x^{(i-1)}$. This means the correlation between two adjacent samples, i.e. the autocorrelation, is not $0$. This is usually taken into account when calculating the effective sample size, since it is smaller when the samples are more correlated, since each sample gives marginally less information of the distribution of interest.

The effective sample size as proposed by \cite{gelman2014bayesian}
is:
$$
N_{eff} = \frac{N}{1 + 2 \sum_{k=1}^{\infty} \rho(k)}
$$

where $N$ is the total number of samples, $N_{eff}$ the effective sample size, and $\rho(k)$ the autocorrelation of the samples at lag $k$. In practical applications the infinite sum is stopped when $\rho(k) < 0.05$
because usually $\rho(k + 1)  < \rho(k)$ holds (\cite{kruschke2014doing}).

How many effective samples are sufficient, and therefore how long the chain should run, depends on the particular application and the measure of interest.

\paragraph{R-hat} 

R-hat is a measure of the convergence of a chain (\cite{gelman2014bayesian}). When a chain converged, it should have mixed and be stationary. It works by splitting up each chain at the half and computing a measure which uses between- and within-chain variance. In the limit $n \to \infty$ R-hat approaches one. Intuitively, if the possible scale reduction is high, further samples can improve the accuracy of the estimate of the target distribution. For practical applications, \cite{gelman2007data} suggest a R-hat threshold of 1.1. In the case study we also use this threshold, rerunning the simulation when R-hat is greater 1.1.

\paragraph{Example usage of Stan}

\begin{example} 
We want to show an example use of Stan using the setup from Example \ref{ex:metropolis-proposal}:

We have a dataset of $N=20$ data points $X_i$, $i = 1 ... N$ and we know the data points to be mutually independent and identically normal distributed with known $\sigma = 0.2$. We want to the a-posteriori distribution of $\boldsymbol{\mathbf{\mu}}$. We assume we know that the parameter lies in the interval $\left[ -10, 10 \right]$ so we choose a uniform prior $U(-10, 10)$ on $\boldsymbol{\mathbf{\mu}}$.

We could incorporate this setup into a Stan model as follows:

\begin{lstlisting}[escapechar=|, caption={Stan example}]
data {
  int N;
  vector[N] x;
}
parameters {
  real mu;
}
model {
  mu ~ uniform(-10, 10);
  x ~ normal(mu, 0.2);
}
\end{lstlisting}

In the data section we define all input parameters of the model. In the parameter section we define our $\boldsymbol{\mathbf{\mu}}$ parameter as a real variable. The model section then defines the uniform prior on $\boldsymbol{\mathbf{\mu}}$ and the normal distribution for $\boldsymbol{\mathbf{X \: \vert \: \mu, \sigma=0.2}}$.

Having defined the model, we then can start the sampling process by calling within R:
\begin{lstlisting}[escapechar=|, caption={R}]
res = stan(model_code=stan_model, data=list(N=length(x), x=x), chains=1, warmup=200, iter=2000, init=0)
\end{lstlisting}

We run the sampler using the same configuration as in Example \ref{ex:metropolis-proposal}, using a warm-up size of 200, total number of steps of 2000, and starting point at 0.

We can use the $summary(res)$ function to get a overview of the inferred parameters. The approximated expected value of $\boldsymbol{\mathbf{\mu \: \vert \: X}}$ is $0.438$, and the 95\% posterior interval\footnote{The $100 (1-\alpha)\%$ posterior interval corresponds to the range of values above and below in which lies $100 (\alpha/2) \%$ of the posterior probability \citep{gelman2014bayesian}} of $\boldsymbol{\mathbf{\mu \: \vert \: X}}$ is $\lbrack0.345, 0.522\rbrack$.

The effective sample size obtained by the sampling process was $N_{eff} = 663$, and the R-hat value was $1.0004098$, which is a indicator that the chain has successfully converged to the target distribution.

When we compare the trace plot and autocorrelation function (Figure \ref{fig:stan_example}), we see that the resulting Markov chain has less autocorrelation than those of Example \ref{ex:metropolis-proposal}.

\begin{figure}[H]
\includegraphics[scale=0.5]{img/stan_example.pdf}


\caption{Experiment \ref{ex:stan}: Stan example using an HMC-based algorithm, Left: Trace plot of $\boldsymbol{\mathbf{\mu \: \vert \: X}}$, Right: Autocorrelation of the samples of $\boldsymbol{\mathbf{\mu \: \vert \: X}}$}
\end{figure}

As we could see in this example, using Stan is very convenient in practice, because it only requires us to specify the model in a declarative way. Because we are using an Hamiltonian Monte Carlo based algorithm, we would normally be required to specify the step size and number of steps for leapfrog and also the covariance matrix $\Sigma$ of $\boldsymbol{\mathbf{\rho}}$. The NUTS algorithm is used by Stan to find good values for these parameters in the warm-up period. Also the gradient of the parameter vector is needed, however Stan automatically calculates these by using the automatic algorithmic differentiation method. 

The R-Code for this example can be found in Appendix \ref{file:stan}.

\end{example}

## Summary

In this chapter we introduced the Bayesian theorem as the basis for Bayesian inference. We further explored the difficulties in the practical applications of Bayesian inference when using complicated models, which are often hard to solve or even mathematically intractable. 

We then proceed to Monte Carlo algorithms to numerically solve the Bayesian inference problem, and thus avoiding this mathematical inconvenience. We saw, although these methods can be used to do Bayesian analysis numerically, they suffer from high variance in higher dimensions. 

We introduced MCMC as an alternative to sample from arbitrary probability distributions using a purpose-built Markov chain. We explored the Metropolis-Hastings algorithm, however we saw, that these algorithm can be inefficient in high dimensions and when using complicated models. An advanced MCMC algorithm, namely Hamilton Monte Carlo is then introduced which aims to solve this efficiency issue by avoiding a random walk. 

In the last section we introduced probabilistic programming languages which provide a domain specific language for doing Bayesian inference using MCMC in a declarative and user friendly way. We further focused on the probabilistic programming language called Stan which will be used in the case study of this thesis. We introduced the techniques, which Stan uses, in particular an HMC based algorithm called NUTS, and algorithmic differentiation to algorithmically obtain the gradients of the target distribution.

In the next chapter, we now use the built theoretical basis from the last two chapter to conduct a case study and investigate whether the Bayesian models are
superior to the classical Mean/Variance MLE approach.



**Utility maximization formulation** When using the efficient portfolio formulation, one has to choose a target return, which is not always obvious. There is an alternative formulation, in which the expected utility of the investor is directly optimized. It can be shown \citep[][e.g., see]{chapados2011portfolio} that the unconstrained minimum variance formulation (by Markowitz) and the utility maximization formulation are equivalent. For this formulation one has to choose a risk aversion parameter $\lambda$, however this parameter has a much more practical interpretation, defining the marginal rate of substitution between expected return and return variance. As pointed out in Section \ref{sec:utility} a rational investor wants to maximize its expected utility and therefore the problem can be defined as:
$$
w^* = \argmax_{w} \mathbb{E} (u(\boldsymbol{\mathbf{R_P}}))\\
= \argmax_{w}  \mu_P - \frac{\lambda}{2} \sigma_P^2\\
= \argmax_{w}  w^T \mu - \frac{\lambda}{2} w^T \Sigma w\\
\text{s.t. }  \mathbf{1}^T w = 1
$$



\begin{example}[Mean/Variance optimization]


We have a hypothetical investable universe of three risky financial assets consisting of two stocks and one bond. We assume the two stocks have yearly expected returns $\mu_1 = 11\%, \mu_2 = 10\%$ and yearly expected volatility of $\sigma_1 = 23\%, \sigma_2 = 22\%$ and a correlation of $\rho_{12} = 0.4$. The bond has a slightly lower yearly return and risk of $\mu_3 = 7\%$ and $\sigma_3 = 12\%$. We assume the bond has a negative correlation to the stocks: $\rho_{13} = -0.2, \rho_{23} = -0.1$.

We can construct the mean vector $\mu$ and covariance matrix $\Sigma$, using the standard deviations $\sigma$ and the correlations $\rho$:\footnote{Given a vector $x \in \mathbb{R}^S$ the $\text{diag}(x)$ function returns a matrix $\in \mathbb{R}^{S \times S}$ with the components of $x$ on the diagonal}
$$
\mu = \begin{pmatrix}
  \mu_1\\
  \mu_2\\
  \mu_3\\
 \end{pmatrix} = \begin{pmatrix}
  0.11\\
  0.1\\
  0.07\\
 \end{pmatrix}, \sigma = \begin{pmatrix}
  \sigma_1\\
  \sigma_2\\
  \sigma_3\\
 \end{pmatrix} = \begin{pmatrix}
  0.23\\
  0.22\\
  0.12\\
 \end{pmatrix}\\
\rho = \begin{pmatrix}
  1  \rho_{12}  \rho_{13}\\
  \rho_{12}  1  \rho_{23}\\
  \rho_{13}  \rho_{23}  1\\
 \end{pmatrix} = \begin{pmatrix}
  1  0.4  -0.2\\
  0.4  1  -0.1\\
  -0.2  -0.1  1\\
 \end{pmatrix}\\
\Sigma = \text{diag}(\sigma) \, \rho \; \text{diag}(\sigma) = \begin{pmatrix}
  0.053  0.020  -0.006 \\ 
  0.020  0.048  -0.003 \\ 
  -0.006  -0.003  0.014 \\ 
  \end{pmatrix}
$$

We now want to construct an efficient portfolio $w_{eff}$ according to the Mean/Variance framework with a yearly target return of $\mu_{target} = 0.1$. Additionally we calculate the global minimum variance portfolio $w_{gmv}$ using the solutions provided by the Mean/Variance framework. Additionally we calculate the expected means and volatilities of the portfolios:
$$
w_{eff} = \begin{pmatrix}{}
  0.53 \\ 
  0.29 \\ 
  0.18 \\ 
  \end{pmatrix}, \; \mu_{p eff} = \mu_{target} = 0.1,  \; \sigma_{p eff} = 0.156\\
w_{gmv} = \begin{pmatrix}{}
  0.18 \\ 
  0.14 \\ 
  0.68 \\ 
  \end{pmatrix},  \; \mu_{p gmv} = 0.081, \; \sigma_{p gmv} = 0.092
$$

We plot the assets, the efficient portfolio, the global minimum variance portfolio and the efficient frontier (representing all obtainable efficient portfolios) in the standard deviation vs. expected return space:
\begin{figure}[H]
\centerline{\includegraphics[scale=0.4]{img/mean-var-ex-plot.pdf}}
 \caption{Example \ref{ex:mv-opt} (Mean/Variance optimization): Black dots: The three assets, Red dot: The efficient portfolio for a target return of 10\%, Green dot: The global minimum variance portfolio, Black curve: The efficient frontier}
 
\end{figure}

Investing in the efficient portfolio with target return 10\%, would mean putting 53\% and 29\% of our wealth in stock 1 and 2, and the remainder of 18\% into the bond. Our constructed portfolio has as nearly as much expected return as the stocks ($\mu_{p eff} = 10\%$), while having much lower standard deviation of $\sigma_{p eff} = 15.6\%$. We also clearly see, the global minimum variance portfolio has the lowest standard deviation among all obtainable portfolios ($\sigma_{p gmv} = 9.2\%$).

The R-Code for this example can be found in Appendix \ref{file:efficient_frontier}.

\end{example}


**Different formulations** Different formulations for the efficient portfolio formulation (as defined in the preceding chapter) have been discussed, e.g. by introducing a risk free asset, incorporating additional constraints into the optimization problem, such as transaction cost constraints, maximum holding constraints, or by using a different optimization function, by not minimizing the variance but instead, for example, the value at risk.

One important constraint, which was already discussed by Markowitz in his original paper, and which we will be using in our experiments, is the short sale constraint, which disallows short-selling, i.e. all individual asset weights must be greater than or equal to 0. This is a constraint, with  which many investors are confronted in practice, since short-selling may involve regulatory (short selling may be disallowed for certain accounts) or practical hurdles (short selling involves  borrowing an asset from a third party which is willing to lend, which may not be available, also this could incorporate additional short-sale fees). 
To solve the portfolio optimization problem with the short sale constraint analytically, an iterative Kuhn-Tucker approach can be used \citep[e.g., see][]{jagannathan2002risk}. Also numerical optimizers, i.e., linear-quadratic solvers, efficiently implement this iterative approach.


## Bayesian based portfolio optimization

In the last section, we introduced the Mean/Variance framework, which provides an formulation for selecting efficient portfolios for risky assets. \cite{avramov2010bayesian} in their survey of Bayesian portfolio selection methods, name three arguments of why the Bayesian portfolio selection approach might be useful:

**Prior information** Pre-known knowledge can be incorporated into the models by using informative prior distributions.

**Parameter uncertainty** The Bayesian approach is one way (including other, non Bayesian techniques, see above) to deal with parameter uncertainty. The problem of parameter uncertainty is naturally incorporated by the Bayesian approach by treating the model parameters $\boldsymbol{\mathbf{\Theta}}$ as probability distributions instead of constants. 

**Convenience of numerical algorithms** Numerical algorithms allow a more declarative approach, where one can focus on the "modeling" part without worrying on the mathematically convenience and/or tractability of the models.

### The Bayesian framework to portfolio optimization

One can roughly divide Bayesian based approaches to portfolio selection into two groups (\cite{avramov2010bayesian}). The first group treats the asset returns as independent and identically distributed (iid), and concentrates on modeling the return distribution only conditional on the historical returns (e.g. by assuming a Multivariate Gaussian distribution and estimating the $\mu$ and $\Sigma$ parameters). The other group treats the asset returns as time dependent and therefore predictable. One example of such a predictable model is estimating a linear regression model where the return is the dependent variable and the independent variables are based on some economic measure, such as GDP growth and treasury bill rate.

An overview of the state of the art of Bayesian based portfolio selection approach is provided in the introduction in Section \ref{sec:stateofart}.

In this thesis, we concentrate on models in group one, i.e. on modeling the return distribution only conditional on the historical returns. In the Bayesian framework, the parameter vector $\boldsymbol{\mathbf{\Theta}}$, which contains all model parameters (e.g. $\boldsymbol{\mathbf{\mu}}$ and $\boldsymbol{\mathbf{\Sigma}}$ in a Multivariate Gaussian distribution setting), is treated as a random variable. For a detailed discussion of Bayesian inference, see Section \ref{sec:bayes-theorem}.

We define the model as the likelihood $p(X \: \vert \: \Theta)$, defining the probability density of the dataset $\boldsymbol{\mathbf{X}}$, given one particular assignment of the parameter vector $\boldsymbol{\mathbf{\Theta}}$, and $p(\Theta)$ the a-priori distribution of $\boldsymbol{\mathbf{\Theta}}$, which includes all knowledge about the parameters a-priori the inference, i.e. before we observe the data. Having a dataset $X$ available at time $t$ (in our case the historical returns of the financial assets up to time $t$), we can use the Bayesian inference formulation to get the a-posteriori distribution density $p(\Theta \: \vert \: X)$:
$$
p(\Theta \: \vert \: X) = \frac{p(X \: \vert \: \Theta) \cdot p(\Theta)}{\int_{\Theta} p(X \: \vert \: \Theta) \cdot p(\Theta) \; d\Theta}
$$

Having the joint posterior densities, we can then integrate out the parameters $\boldsymbol{\mathbf{\Theta}}$ to obtain the predictive return density:
$$
p(R_{t+1} \: \vert \: X) = \int_{\Theta} p(R_{t+1} \: \vert \: \Theta, X) \; d\Theta
$$

Then the Bayesian framework to portfolio optimization can be formulated as a utility maximization of the predictive return distribution (\cite{avramov2010bayesian}):
$$
w_{Bayes} = \argmax_w \int_{R_{t+1}} u(w) \; p(R_{t+1} \: \vert \: X) \; dR_{t+1}
$$

In our case study we use different Bayesian models to estimate $\boldsymbol{\mathbf{\Theta}} \: \vert \: X$, which are further motivated in Section \ref{sec:bayes-models}. We approximate the predictive return density with Markov Chain Monte Carlo by numerically integrating out the parameters. We then calculate the optimal portfolio using direct expected utility optimization (Section \ref{sec:direct-expected-utility}).

### Using the Bayesian framework for Mean/Variance optimization


The Mean/Variance framework uses the first two moments of the return distribution (the expected value $\mu$ and the variance-covariance matrix $\Sigma$) to calculate an efficient portfolio. In a Bayesian setting, we can obtain the expected value $\mu = \mathbb{E}(\boldsymbol{\mathbf{R_{t+1}} \: \vert \: X})$ and variance $\Sigma = Var(\boldsymbol{\mathbf{R_{t+1}} \: \vert \: X})$ of the predictive return distribution $\boldsymbol{\mathbf{R_{t+1}} \: \vert \: X}$. As \cite{polson2000bayesian} points out, these statistics can be calculated as\footnote{$Var(R_{t+1} \: \vert \: X)$ is decomposed using the law of total variance (see \cite{weiss2005course})}:
$$
\mu = \mathbb{E}(\boldsymbol{\mathbf{R_{t+1}} \: \vert \: X}) = \mathbb{E}(\boldsymbol{\mathbf{\mu \: \vert \: X}})\\
\Sigma = Var(\boldsymbol{\mathbf{R_{t+1}} \: \vert \: X})\\ 
=\mathbb{E}(Var(\boldsymbol{\mathbf{R_{t+1}} \: \vert \: \mu, \Sigma, X})) + Var(\mathbb{E}(\boldsymbol{\mathbf{R_{t+1}} \: \vert \: \mu, \Sigma, X}))\\
=\mathbb{E}(\boldsymbol{\mathbf{\Sigma \: \vert \: X}}) + Var(\boldsymbol{\mathbf{\mu \: \vert \: X}})
$$

As we can see, we can calculate the expected value for the predictive return distribution using the expected value of the marginal a-posteriori mean $\boldsymbol{\mathbf{\mu \: \vert \: X}}$. For the variance of the predictive return distribution we can use the marginal a-posteriori variance-covariance matrix $\boldsymbol{\mathbf{\Sigma \: \vert \: X}}$, as one would expect, but we have to add an additional term to correct for parameter uncertainty, using the variance of the marginal a-posteriori mean $\boldsymbol{\mathbf{\mu \: \vert \: X}}$. 
This correction is consistent with a correction used for parameter uncertainty in a non-Bayesian setting \citep[e.g., see][]{dangl2017long}. 


## Utility 
% ----------------------------------------------------------------------------------
% ----------------------------------------------------------------------------------
% ----------------------------------------------------------------------------------

In this section, we provide a brief introduction to utility theory and show how and why we chose our utility function used for the direct expected utility optimization technique. This section is based on the texts by \cite{norstad1999introduction} and \cite{johnson2007utility}.

A utility function $u(m)$ is a function which maps from a measure of wealth to the perceived value of that wealth for an investor (\cite{johnson2007utility}). A utility is twice differentiable with the property of non-satiation, which means an investor always gets some additional utility by getting more wealth ($u'(m) > 0$) and the property of risk aversion ($u''(m) < 0$).

The principle of expected utility maximization states, that a rational investor, when faced with more than one possible outcome, chooses that action, which maximizes the expected utility (\cite{norstad1999introduction}). The classical Markowitz approach is consistent with this principle, since the Markowitz optimization approach can also be viewed as a expected utility maximization problem (see Section \ref{sec:markowitz-portfolio}).

In the portfolio optimization setting (see Section \ref{sec:markowitz-portfolio}) we are faced with this type of uncertainty, we have a set of possible outcomes (in our case the predictive return vector $\boldsymbol{\mathbf{R_{t+1}}}$ for a set of assets for the next period) and a set of possible actions (in our case choosing in which assets to invest, i.e. choosing the portfolio weight vector $w$).
To act according to the expected utility maximization we choose our portfolio such that our portfolio weights $w^* = \argmax_w \mathbb{E}(u(\boldsymbol{\mathbf{R_{t+1}}} w))$.

There is one important measure of utility functions which measures the relative risk aversion of a utility function based on a measure of wealth $m$ (\cite{johnson2007utility}):

$$Rr(m) = -m \frac{u''(m)}{u'(m)}$$

Relative risk aversion measures risk aversion to a loss relative to the investors wealth. Increasing relative risk aversion (IRRA)/Decreasing relative risk aversion (DRRA) state, that when his/her wealth increases he/she will hold more/less fractions of total wealth in risky assets. In the case of constant relative risk aversion (CRRA) the investor will hold the same fractions in risky assets as his/her wealth increases.

We assume the initial wealth in our experiments is an arbitrarily chosen number, e.g. 1 Mio. \$, and we don't want an influence of the absolute value of wealth to our portfolio choices in our experiments, so we choose the isoelastic utility function which has the CRRA property.
This also simplifies our calculations, since we can directly work with relative changes of the wealth instead of absolute value of wealth.

The isoelastic utility function (also called power-utility function or CRRA utility function) is given by:

$$u(m)={\begin{cases}{\frac  {m^{{1-\eta }}-1}{1-\eta }}&\eta \neq 1\\\ln(m)&\eta =1\end{cases}}$$

Where $\eta$ is the risk aversion and defines the risk preferences of the investor. 

There is an ongoing debate, on which value for $\eta$ is realistic for an average (human) investor. For our experiments we chose a value of $\eta = 3$, based on our own intuition. Using $\eta = 3$, the utility of gaining $20\%$ is $u(0.2) = 0.15$, whereas the utility of loosing $20\%$ of our wealth is $u(-0.2) = -0.28$, so about as twice as bad in terms of utility, which seems reasonable. For higher values of $\eta$ the utility falloff in the negative regions is much faster, e.g. for $\eta = 8$ the utility of loosing $20\%$ vs. gaining $20\%$ is 5 times as bad, which is in our opinion unrealistic. 

Since we don't have the case with $\eta=1$, and since we work with relative changes of wealth, rather than absolute changes of wealth, we redefine our utility function in terms of returns, substituting the wealth $m$ with the return $r$, $m = 1 + r$ (allowed because of the CRRA property): 
$$u(r)=\frac{(1+r)^{{1-\eta }}-1}{1-\eta}$$

In our experiments we work with monthly returns, after inspecting the dataset used in the case study (for details, see Section \ref{sec:dataset}), we found the returns roughly to be in the range of -20\% to 20\%. In Figure \ref{fig:crra-utility-plot} we plotted the utility functions in the relevant range.

\begin{figure}[H]
\includegraphics[scale=0.5]{img/crra-utility-plot.pdf}
\caption{CRRA utility function $u(r)$ for a relative change of wealth $r$, with risk aversion parameter $\eta = 3$ (left) and $\eta = 8$ (right). For our experiments we chose $\eta=3$.}

\end{figure}

### Direct expected utility maximization 

As said, to act according to the expected utility maximization we choose our portfolio such that our portfolio weights maximize the expected utility dependent the predictive return vector $\boldsymbol{\mathbf{R_{t+1}}}$\footnote{We use the notation $\mathbf{x}$ (bold) to denote a stochastic variable, vector or matrix, as opposed to $x$ which is an ordinary scalar, vector or matrix}. In this section we explain how we define the optimization problem and how we used the numerical optimization procedure called Sequential Quadratic Programming (SQP) to find a solution to the the constrained optimization problem.

As discussed in detail in Section \ref{sec:backtest}, we use the numerical Markov Chain Monte Carlo procedure to obtain $N$ representative samples from $\boldsymbol{\mathbf{R_{t+1}}}$ and can only approximate the expected utility by calculating the arithmetic average for the utility of each possible outcome. We obtain a sample-matrix $R^{(ij)} \in \mathbb{R}^{N \times S}$, which is a representation of the predictive return vector $\boldsymbol{\mathbf{R_{t+1}}}$, where each $j = 1..S$ column is one asset, and each $i = 1..N$ row is one representative sample (outcome) of $\boldsymbol{\mathbf{R_{t+1}}}$.

As discussed in the preceding section, we chose the isoelastic utility function $u(r) = \frac{(1 + r)^{1 - \eta} - 1}{1 - \eta}$, where $\eta$ denotes the risk aversion and $r$ the  portfolio return. For a theoretical discussion of utility theory and the isoelastic utility function see Section \ref{sec:utility}.

The goal of the procedure is, to calculate the portfolio weight vector $w \in \mathbb{R}^S$ for our portfolio which maximizes the expected utility. $w_j = c$ means we invest a fraction of $c$ of our portfolio in asset $j$. Furthermore we introduce two additional  optimization constraints: First, that we are fully invested (the portfolio weights sum to 1), and second, that no short sales are allowed (each weight is $\ge 0$).

\paragraph{Sequential Quadratic Programming}

Sequential Quadratic Programming (SQP) is one of the most successful (\cite{boggs1995sequential}) method for solving nonlinear constrained optimization methods of the form:
$$ 
\min_{x} \; f(x)\\
\text{s.t.:} \; g(x) = 0,\; h(x) \le 0\\
f:  \mathbb{R}^n \to  \mathbb{R}, \; h: \mathbb{R}^n \to  \mathbb{R}^m, \; g: \mathbb{R}^n \to  \mathbb{R}^p
$$

The idea in Sequential Quadratic Programming is to create an approximate solutions by constructing a quadratic programming subproblem, and then iteratively improve this solution by using the last solution as the starting point for the next subproblem. As SQP relies on quadratic subproblems, it benefits from the fact that there are very efficient algorithms for solving quadratic programming problems available. 

Fortunately there is an already implemented SQP procedure for R in the library \verb|nloptr| available. The SQP optimization is called with the function \verb|slsqp()|, which takes the target function to be minimized $f$, the gradient of $f$, the equality constraint functions $g_i$, the inequality constraint functions $h_i$. 

As said, we approximate the expected utility by calculating the arithmetic average of the utility of each of the $N$ samples. Our optimization problem is:
$$\max_{w} \mathbb{E} \big[ \, u(\boldsymbol{\mathbf{R_{t+1}}} w) \big] \approx \max_w \frac{1}{N} \sum_{i=1}^N \, u(\sum_{j=1}^S R^{(ij)} w_j)$$ 
$$\text{s.t. } \sum_{j=1}^S w_j = 1 \text{ and } w_j \ge 0 \; \forall \; j \in 1..S $$

We can eliminate the $w_j \ge 0$ constraints by substituting $w_j = v_j^2$. To switch from maximization to minimization we multiply the target function by $-1$.

$$f(v) = -\frac{1}{N} \sum_{i=1}^N \, u(\sum_{j=1}^S R^{(ij)} v_j^2) = -\frac{1}{N} \sum_{i=1}^N \, \frac{(1 + \sum_{j=1}^S R^{(ij)} v_j^2)^{1-\eta} - 1}{1-\eta}$$

$$g_1(v) = \sum_{j=1}^S (v_j^2) - 1 = 0$$

Then we derive the gradients as (for a proof, see Appendix \ref{sqp-gradient}):
$$ 
\frac{\partial{f}}{\partial{v_g}}	= -2 v_g  \frac{1}{N} \sum_{i=1}^N \Big[ R^{(ig)}  (1 + \sum_{j=1}^S R^{(ij)} v_j^2)^{-\eta} \Big]\\
\frac{\partial{g_1}}{\partial{v_g}}	= 2 v_g\\
$$

The implementation in R can be found in the file \verb|direct-expected-utility.R| function \verb|f.opt.sqp()|.

\paragraph{Convergence}

The SQP method, like other gradient based methods, guarantees only to find local extrema rather than the global extrema, i.e. the found extrema depend on the starting points. To investigate the global convergence behavior, we conducted a large number of experiments, where we initialized the starting points (in our case the weight vector) randomly using some artificially generated returns. We could not find a case where different starting points led to different extrema, so it seems that SQP always converges to the global extrema for our type of optimization formulation.

## Pitfalls of backtesting

In the case study in Section \ref{sec:case} we will be using a method called backtesting (also called historical simulation) to investigate the performance of our models in a simulated real-world scenario. For details, how we set up the backtesting procedure, take a look at Section \ref{sec:backtest}.

There are some pitfalls which one can fall into in the setup of a backtest which lowers the validity of the conducted experiments. In this section we discuss four commonly known pitfalls (\cite{defusco2015quantitative}) 
and how we set up our experiments in order to avoid them. 

\paragraph{Survivorship bias}

Survivorship biased data includes only winners, in the sense that companies, which went to bankruptcy got delisted or merged aren't included in the dataset (\cite{defusco2015quantitative}). This makes the results biased because a company which is bankrupt is likely to have lower returns on it's stock price than the average. \cite{shumway1997bias} shows that the survivorship bias is significant and that most datasets don't include delisting data. Also this bias applies when one selects a investment universe based on current data and then conducts a backtest based on that universe. One example is choosing a investment universe from the current constituents of the S\&P 500 and conducting a backtest, this biases the returns upwards, because companies which weren't in the S\&P 500 at the start of the experiment must have done well to be included, and also companies which were included in the S\&P 500 at the start of the experiment but aren't included in the investment universe because they are not part of the S\&P 500 anymore must have done badly. To avoid this kind of problem, one must use the constituent data from the start of the experiment.

We avoid this fallacy by using a dataset which includes constituent data, and only use such returns, which are member of the particular index.

\paragraph{Look-ahead bias} 

A backtest is look-ahead biased when it uses data which was not available at a particular time (\cite{defusco2015quantitative}). One example of this fallacy is a model, which uses accounting information (e.g. earnings report data) of a particular financial year of the company and makes decisions based on this data at the end of this financial year. This kind of setup is look-ahead biased but this is not that obvious, because for example using accounting data for the financial year $t$ at the end of year $t$ seems fine, however this kind of data is usually released much later and this information wasn't available at the end of year $t$ back then, so this use of data is clearly biased. Although the data is for the financial year $t$, one must use the data only after its original release date (e.g. year $t+1$) to get unbiased results.
Another not so obvious example of look-ahead bias is the following: Imagine a mean reversion model for a currency pair (e.g. EUR/USD) where we buy the currency, when it is below the mean value $\mu$, and sell the currency when it is above the mean value $\mu$. If we have a dataset $X_t$ which contains prices from time $t=0$ to $T$ and calculate the mean as $\mu = 1/T \sum_{t=0}^{T} X_t$ this experiment is clearly biased, although it doesn't use data from future directly, it uses values, which are derived from future data, i.e. the "real" $\mu$ wasn't known in earlier periods. The correct approach, to avoid look-ahead bias, would be to calculate $\mu$ for period $\delta$ as $\mu_\delta = 1/\delta \sum_{t=0}^{\delta} X_t$, which only uses data which is known up to this time-point.

We avoid this fallacy at the programming level by using a backtest design in which the models can  access the data over a specific interface, and which does not allow to query data from the future.

\paragraph{Time-period bias}

Time-period bias occurs when a specific model or characteristic wants to be shown and the tested time period was chosen, for which this specific characteristic was present (\cite{defusco2015quantitative}). Usually this bias is reduced by using longer time frames to conduct the experiments.

Although there is no fool-proof way to completely avoid this fallacy, we try to minimize it by using a long time period to conduct our experiments (25 years of data).

\paragraph{Data snooping bias}

Data-snooping bias (\cite{head2015phack}, also called p-hacking) is conducting several statistical tests on a single dataset and then reporting the false positives as statistically significant. For example if we statistically test the superiority of 100 models against some reference models with a significance level of $5\%$ we are expected to get 5 false positives by definition. \cite{head2015phack} talks about publication pressure and incentives to publish statistically significant results. There is evidence, that journals are more likely to publish results that look significant. However, the paper also concludes that, while false positives can be sticky because positive studies receive more attention and p-hacking is very common in literature, its overall effect on the scientific progress is relatively weak.

We try to avoid this fallacy by reporting the detailed results of all conducted experiments.

## Summary

In the first two sections of this chapter we first introduced the Mean/Variance framework, originally introduced by Markowitz, and discussed how an investor can build an efficient portfolio. We then introduced the Bayesian based portfolio formulation, which is an alternative approach to the portfolio selection problem. We also showed, how the Bayesian framework can be used in the Mean/Variance optimization setting. We then looked into the theory of utility. We introduced the CRRA utility function and then looked into the SQP-method for direct expected utility maximization, which is an alternative to the Mean/Variance optimization framework, by directly optimizing investors utility. In the last part we looked into some common pitfalls of backtesting.


To summarize, in this chapter we built the basis for the different approaches to portfolio optimization used in the case study in the practical part of this thesis. In the next chapter we build the theoretical foundation of Bayesian methods and Markov chain Monte Carlo.


# Bayesian statistics and Markov Chain Monte Carlo

We begin this chapter, by showing how the Bayesian theorem (Bayesian formula) is derived, then we take a dive into the concept of Bayesian inference and how it is used to make conclusions using the so called a-posteriori distribution.

We proceed to methods and algorithms to numerically solve the Bayesian inference problem. We will begin by introducing Monte Carlo methods in general and how the use Random Number Generators to answer specific questions. We then proceed to the ideas of Markov Chain Monte Carlo and take a detailed look at two specific MCMC algorithms, namely Metropolis-Hastings and Hamilton Monte Carlo.

In the last section we introduce probabilistic programming languages (PPL), and in particular Stan which is one instance of such a PPL. PPL provide a domain specific language for doing Bayesian inference using MCMC in a declarative and user friendly way.

We use the notation $\mathbf{x}$ (bold) to denote a stochastic variable, vector or matrix, as opposed to $x$ which is an ordinary scalar, vector or matrix.

## The Bayesian theorem and Bayesian inference


The goal of Bayesian inference is to make conclusions on a parameter $\boldsymbol{\mathbf{\Theta}}$ of the model based on observed, fixed data $X$. In the Bayesian world all parameters are random variables. We are usually interested in the so called a-posteriori density function of the parameters conditioned on the observed data $p_{\boldsymbol{\mathbf{\Theta \: \vert \: X}}}(\Theta \: \vert \: x)$, which incorporates all knowledge about the parameters $\boldsymbol{\mathbf{\Theta}}$ after seeing the data, in particular it tells us, how "probable" each of the possible parameter assignments $\boldsymbol{\mathbf{\Theta}}$ is. The a-posteriori distribution can be calculated with the Bayesian theorem after defining the likelihood $p(X \: \vert \: \Theta)$, and $p(\Theta)$ the a-priori distribution of $\boldsymbol{\mathbf{\Theta}}$.

The Bayesian theorem (Bayesian formula) directly follows from the definitions of conditional probabilities and the law of total probability (\cite{gelman2014bayesian}) and is defined for two continuous random variables $\boldsymbol{\mathbf{X}}$ and $\boldsymbol{\mathbf{\Theta}}$ as:

\begin{equation} 
p(\Theta \: \vert \: X) &=  \frac{p(\Theta, x)}{p(X)} \\
 &=  \frac{p(X \: \vert \: \Theta) \cdot p(\Theta)}{p(X)} \\
 &= \frac{p(X \: \vert \: \Theta) \cdot p(\Theta)}{\int_{\Theta} p(X \: \vert \: \Theta) \cdot p(\Theta) \; d\Theta}
\end{equation}

$p(X \: \vert \: \Theta)$ is the likelihood, defining the probability density of the dataset $\boldsymbol{\mathbf{X}}$, given one particular assignment of the parameter vector $\boldsymbol{\mathbf{\Theta}}$.

$p(\Theta)$ is the a-priori distribution of $\boldsymbol{\mathbf{\Theta}}$ and this distribution includes everything that we know about the parameter a-priori the inference, i.e. before we observe the data. A-priori distribution can be \textit{non-informative}, which can be interpreted as a distribution, which expresses no particular subjective believe about the distribution of $\boldsymbol{\mathbf{\Theta}}$, although there is no commonly agreed definition of what non-informative prior is and how it should be constructed. The principle of insufficient reason, originally formulated by Bernoulli and Laplace, \cite{sinn1980rehabilitation}, says that, if you know nothing about $\boldsymbol{\mathbf{\Theta}}$ you should use a probability which assigns equal probability for every possible outcome, i.e. a uniform distribution. This seems an obvious choice, but the use of uniform priors is often problematic because it is improper when using an unbounded parameter space in $\boldsymbol{\mathbf{\Theta}}$ (\cite{syversveen1998noninformative}). An improper prior doesn't integrate to one, this might or might not be a problem, in some cases the posterior is proper anyways.


As we can see the choice of non-informative priors is not straightforward, often the prior is chosen based on the principles of information theory. One choice is to use a prior distribution which maximizes the entropy, and therefore minimizes the embedded information in the distribution based on some constraints of the parameter space (\cite{shore1980axiomatic}). This is called the principle of maximum entropy (Maxent), for example the probability distribution which maximizes the entropy for the parameter space $(0, \infty)$, with the constraint that the expected value $\mathbb{E}(\boldsymbol{\mathbf{\Theta}})$ must exist, is the exponential distribution, in contrast, if we relax the constraint and say the expected value doesn't have to exist, the Maxent distribution would be the unbounded uniform distribution (\cite{conrad2013probability}).

Another popular choice is to use Jeffrey's prior (\cite{jeffreys1946invariant}) which chooses a prior such that $p(\Theta) \propto \sqrt{\operatorname{det} \mathbb{I}(\Theta)}$, where $\mathbb{I(\cdot)}$ is the Fisher information, which also is a measure of the amount of information of an random variable.

For practical reasons, often prior distributions are chosen, which make the Bayesian formula analytically tractable. This is done using so called conjugate families (\cite{bernardo1994bayesian}). An a-priori distribution is chosen (the conjugate prior), so that the a-posteriori distribution has the same "structure" (distribution family) as the a-priori distribution, and therefore making to solve the Bayesian formula convenient. When using a Hamilton Monte Carlo algorithm, analytical tractability is no issue, so the a-priori distribution can be chosen which best represents the a-priori knowledge, whether it is analytically tractable or not.

% ----------------------------------------------------------------------------------

## Monte Carlo methods and Random Number Generators

Monte Carlo methods are a broad base of numerical algorithms, which use repeated random sampling using random number generators (RNG's) to answer specific mathematical questions, that would otherwise hard or even impossible to answer using plain analytical derivations. Monte Carlo methods were pioneered by Enrico Fermi, Stanislaw Ulam and John Von Neumann in the 1930's and 1940's and are used extensively in many scientific fields, including Finance, Physics, Chemistry and Medicine, since then.

Since Monte Carlo algorithms rely on random numbers, in this section we talk about different ways to generate random numbers, and in particular how a computer as a deterministic device generates random numbers (\cite{shonkwiler2009explorations}).

In the beginning we must distinguish between "real" random numbers, which are created by a nondeterministic source, and pseudo random numbers, which are created by deterministic devices and try to "mimic" real random sequences.

Real random numbers are generated by measuring properties of nondeterministic physical processes. Examples of such physical random generators are measuring radioactive decay or measuring noise of a sensor. These processes are all well known to be nondeterministic.

A computer is a deterministic device, which means that for a given fixed input it always produces the same results, and therefore has no stochastic (random) components in itself, it is, by definition, impossible to generate real random numbers within a computer without using external sources of randomness (e.g. user input or physical randomness sources). Real random number generators are usually not available on consumer hardware without using special devices, e.g. a USB device which measures random noise, but since only some properties of real random numbers are wanted, in practice pseudo random number generators are used to simulate the behavior of real random numbers.

For Monte Carlo algorithms, 
the non-deterministic component is often unwanted, for example when the reproducibility of experiments is required. This is usually accomplished by providing the {\it seed} value, which is the initialization number of the pseudo random number generator. Given the seed number, the sequence of numbers which is generated by a pseudo random number generator is completely predictable when the RNG algorithm is known. This is usually not an issue when using Monte Carlo for numerical simulation, but it is unwanted when using RNG's for cryptographic applications, for example encryption. In this case the seed value used is usually a number which is hard to predict, for example the current time or the nanoseconds since the computer started up. 

Pseudo random number generators usually generate $U(0, 1)$ random numbers, i.e. a sequence which is distributed uniformly in the interval $[0, 1]$. The inversion method \cite{devroye1986general} allows us to generate sequences of any probability distribution if we know the quantile function $F^{-1}$, which is the inverse of the cumulative distribution function.

Let $F$ be a right-continuous cumulative distribution function on $\mathbb{R}$ and quantile function $F^{-1}$ with $F^{-1}(p) = \inf \Big\{ x \; : \; F(x) = p, 0 < p < 1 \Big\}$. If $\boldsymbol{\mathbf{u}}$ is a random variable with $U(0, 1)$ distribution, then $F^{-1}(\boldsymbol{\mathbf{u}})$ has cumulative distribution function $F$ (Inversion method):
$$
P(F^{-1}(\boldsymbol{\mathbf{u}}) \le x) = P(\inf \{ y \; : \; F(y) = \boldsymbol{\mathbf{u}}\} \le x)\\
= P(\boldsymbol{\mathbf{u}} \le F(x))\\
= F(x)
$$

\begin{example}[Generation of exponential distributed random variables]


The exponential cumulative distribution function is defined as $F(x) = 1 - e^{\lambda x}$, for $x \ge 0$. We calculate the inverse of the cumulative distribution function $F^{-1}(p) = \frac{-\ln(1 - p)}{\lambda}$. In this example we generate $N = 10000$ samples of $U(0, 1)$ distributed numbers using the R function {\it runif}, and then plug the numbers in the quantile function $X = F^{-1}(U)$, which should result in exponential distributed numbers. To check the results the histogram of the samples $U$ and $X$ and the theoretical density functions (red line), as well as the empirical cumulative density function of $X$ and the theoretical cumulative density function (red dashed line), are plotted. As expected, $X$ is exponential distributed.  In this example we set $\lambda = 5$.

% inversion-method.R
\begin{lstlisting}
N = 10000
lambda = 5

U = runif(N, min = 0, max = 1)
X = -log(1 - U) / lambda
\end{lstlisting}


\begin{figure}[H]
\includegraphics[scale=0.5]{img/inversion-method-example.pdf}
 \caption{Example \ref{ex:inversion-method}: Histogram of samples U and X, Empirical CDF of X, red lines are the theoretical functions}
 
\end{figure}

\end{example}

### Monte Carlo integration

One instance of a Monte Carlo based algorithm is Monte Carlo integration.

Suppose we can obtain identically and independently distributed (i.i.d.) samples $x^{(i)}$ from some random variable $\boldsymbol{\mathbf{x}}$ with density $p(x)$, then we can use the arithmetic average of the function of the samples to approximate a definite integral over the density function and some function $f$ using the strong law of large numbers \citep{jordan2010sampling,andrieu2003introduction}. The arithmetic average converges almost surely (a.s., which means with probability 1) to the definite integral, as the number of samples $N$ goes to infinity:
$$
\frac{1}{N} \sum_{i=1}^N f(x^{(i)}) \; {\xrightarrow {\text{a.s.}}}\ \int_{x \in X} f(x) \; p(x)  dx \qquad {\textrm {when}}\ N\to \infty 
$$

We can use this form to approximate e.g. the expected value $\mathbb{E}(\boldsymbol{\mathbf{x}})$ using $f(x) = x$, or the variance $Var(\boldsymbol{\mathbf{x}})$ using $f(x) = (x - \mathbb{E}(x))^2$. 

The rate of convergence of the arithmetic average is proportional to $\sqrt{N}$ but this proportionality constant increases exponentially with the dimension of the integral \citep{jordan2010sampling}.

As said, for this method we have to be able to directly sample from $\boldsymbol{\mathbf{x}}$, however for Bayesian inference, we cannot obtain independent samples from the a-posteriori distribution in the general case, because this involves solving the Bayesian formula, which could be very hard or even intractable. 

There are other Monte Carlo methods, such as Rejection sampling or Importance sampling, which allow to sample from $\boldsymbol{\mathbf{x}}$ using a proposal distribution which is similar to $p(x)$ but easier to sample from. However easy-to-sample from proposal distributions may be impossible to obtain (\cite{andrieu2003introduction}), or the samples suffer from high variance in higher dimensions (\cite{andrieu2003introduction}).

In the next section we are going to explore a different idea, by sampling not independent, but slightly dependent samples from $\boldsymbol{\mathbf{x}}$ using Markov Chains.

## Markov Chain Monte Carlo

In the last section we mentioned Monte Carlo algorithms, which can generate independent samples from some random variable $\boldsymbol{\mathbf{x}}$. However we also noted, that when using these methods, the variance of the samples increases greatly in higher dimensions. 

Markov Chain Monte Carlo is a different strategy for generating samples from some random variable $\boldsymbol{\mathbf{x}}$. Instead of obtaining independent samples, a MCMC procedure generates samples dependent on the last step.

We introduce the Markov chain theory according to \cite{andrieu2003introduction}, \cite{jordan2010sampling} and \cite{chang2007processes} and using finite state spaces, i.e. $\boldsymbol{\mathbf{x}}$ can only take discrete values.

**Markov chain** A sequence $\boldsymbol{\mathbf{x^{(i)}}}$ of random variables is called a Markov chain if it holds the Markov property:
$$
p(x^{(i)} \: \vert \: x^{(i-1)}, ..., x^{(1)}) = p(x^{(i)} \: \vert \: x^{(i-1)}) = T(x^{(i)} \: \vert \: x^{(i-1)})
$$
To specify a Markov chain (\cite{chang2007processes}), a state space $\mathbb{S} \in \{1, 2, ..., M\}, \boldsymbol{\mathbf{x^{(i)}}} \in \mathbb{S}$, an initial probability distribution for $\boldsymbol{\mathbf{x^{(0)}}} \sim p_0(x^{(0)})$ and a probability transition function $T(\boldsymbol{\mathbf{x^{(i)}}} = x \: \vert \: \boldsymbol{\mathbf{x^{(i-1)}}} = x')$ is needed. If the state space is finite, one can specify a matrix $P \in \lbrack 0, 1 \rbrack^{M \times M}$, where $P_{rc} = T(\boldsymbol{\mathbf{x^{(i)}}} = x_c \: \vert \: \boldsymbol{\mathbf{x^{(i-1)}}} = x_r)$, i.e. each row $r$ defines the current state and each column defines the probability going to the the state $c$ conditional on being on the row $r$. Each row must, of course, sum to one.

\begin{example}[Example Markov chain specification] 
We define a Markov chain with state space $\mathbb{S} = \{A, B, C\}$, starting point $p_0 = A$ and transition matrix 
$$P = \begin{pmatrix}
  0 	& 0.2	& 0.8  \\
  0		& 0.5	& 0.5	\\
  1		& 0		& 0	
 \end{pmatrix}$$

In Figure \ref{fig:markov-chain-ex} we can see a graphical representation of the Markov chains, where the circles represent the states and edges represent the transition probabilities. In this example, the initial state is $A$ then the probability of going from state $A$ to $B$ is $P_{12} = 0.2$ and going to state $C$ is $P_{13} = 0.8$.

\begin{figure}[H]
\includegraphics[scale=0.5]{img/markov-chain.pdf}
\caption{Experiment \ref{ex:markov-chain}: Graphical representation of the Markov chain specified in the example}

\end{figure}
\end{example}

**Markov chains for MCMC** For MCMC, one chooses the transitions for the Markov chain, such that the target distribution $p(x)$ is invariant for the Markov chain (also called stationary distribution or equilibrium distribution of the Markov chain):
$$
p(x) = \sum_{x'} T(x \: \vert \: x') \; p(x')
$$

A sufficient, but not necessary condition to show that a particular $p(x)$ is the invariant distribution, is the detailed balance condition (also called reversibility condition):
$$
p(x') \; T(x \: \vert \: x') = p(x) \; T(x' \: \vert \: x)
$$

The sufficiency of this condition can easily be seen by summing both sides with all possible values for $x$\footnote{Note: $\sum_{x'} T(x' \: \vert \: x) = 1$, because all outgoing transition probabilities must, of course, sum to 1}:
$$
\sum_{x'} p(x') \; T(x \: \vert \: x') = \sum_{x'} p(x) \; T(x' \: \vert \: x) = p(x)
$$

Another important property of the Markov Chain for MCMC is, that one chooses the transitions as such, that they eventually converge to the chosen invariant distribution $p(x)$. This is true if the transition function holds the following properties:

**Irreducibility** For every possible state of the Markov chain, there is positive probability of visiting all other states:
$$
\forall x_0, x_1 \in \mathbb{S}: \sum_{i=0}^{\infty} P(X_i=x_1 \: \vert \: X_0 = x_0) > 0
$$

**Aperiodicity** The chain cannot get trapped in cycles: An irreducible Markov chain is defined as aperiodic, if its period\footnote{Given a Markov chain $\boldsymbol{\mathbf{x^{(i)}}}$ with transition matrix $P$, the period $d_i$ of state $i$ is defined as $d_i = gcd\{ n: P^n_{ii} > 0 \}$, where gcd\{x\} is the greatest common divisor of set $x$}\footnote{All states in an irreducible Markov chain have the same period} is 1.

When we construct a Markov chain with these two properties we have an asymptotic guarantee, that the individual distributions of each $\boldsymbol{\mathbf{x^{(i)}}}$, which are dependent on $i$ eventually converge to the invariant distribution. 

Let $\boldsymbol{\mathbf{x^{(0)}}}, \boldsymbol{\mathbf{x^{(1)}}}, ...$ be a Markov chain with invariant distribution $p(x)$ which is irreducible and aperiodic, then for all initial distributions $p_0$ of $\boldsymbol{\mathbf{x^{(0)}}}$ (i.e. starting points) holds (Basic limit theorem of Markov chains, \cite{chang2007processes}):
$$
\lim_{i \to \infty} p_i(x) = p(x)
$$

#### Summary

In this section, we introduced the Markov chain theory as the basis for all MCMC algorithms, and specifically which properties of a Markov chain are important for MCMC. 

A MCMC sampling algorithm constructs a Markov chain which has a specific target distribution as the invariant distribution. In case of Bayesian inference the target distribution is the a-posteriori density distribution of a Bayesian model. We can use the detailed balance condition to show, that the target distribution is the invariant distribution. 

It is also of interest, to show if an Markov chain converges to this invariant distribution independent of the starting point. We can use irreducibility and aperiodicity conditions to show that the chain eventually converges to the target distribution. When using MCMC in practice, there are measures, for example R-hat the possible scale reduction factor (see Section \ref{sec:rhat}), to check whether a chain has converged to the stationary distribution or not.

In the next sections, we are going to introduce the actual MCMC algorithms, which are methods to construct Markov chains with such properties.

## Metropolis-Hastings algorithm


The Metropolis-Hastings algorithm, introduced by \cite{metropolis1953equation} and further generalized by \cite{hastings1970monte} is one of the simplest and easiest to understand MCMC algorithms.

As said, the goal a MCMC algorithm is now to construct a Markov chain, whose invariant distribution is the distribution of interest, i.e. we want to "walk through" (to sample from) the parameter space in proportion to the target distribution $p_{\boldsymbol{\mathbf{\pi}}}(x)$ (which is usually the a-posteriori density of a Bayesian model in the case of Bayesian inference $p_{\boldsymbol{\mathbf{\pi}}}(x) = p(\Theta \: \vert \: X)$).

The algorithm works by first choosing a candidate point $x'$ randomly sampled from a proposal distribution (also called jumping rule) $\boldsymbol{\mathbf{\boldsymbol{\mathbf{q \: \vert \: x^{(i)}}}}}$. This distribution is not fixed and is conditional on the current point in the chain. Usually a proposal distribution is chosen whose expectation is the current point $\mathbb{E} (\boldsymbol{\mathbf{q \: \vert \: x^{(i)}}}) = x^{(i)}$, although this is not required.  A number $c$ is sampled from a $U(0, 1)$ distribution. If $c > \alpha(x^{(i)}, x')$ the candidate point is accepted setting $x^{(i+1)} := x'$ otherwise the chain does not move and stays at its current position $x^{(i+1)} := x^{(i)}$. The function $\alpha$, which defines the candidate point acceptance is only dependent on the current point in the chain and is given by

$$\alpha(x, y) = \min \Big( 1, \frac{p_{\boldsymbol{\mathbf{\pi}}}(y) \; p_{\boldsymbol{\mathbf{q \: \vert \: x^{(i)}}}}(x \: \vert \: y)}{p_{\boldsymbol{\mathbf{\pi}}}(x) \; p_{\boldsymbol{\mathbf{q \: \vert \: x^{(i)}}}}(y \: \vert \: x)} \Big)$$

\begin{lstlisting}[escapechar=|, caption={Metropolis-Hastings Algorithm}]
|$x^{(1)}$| = |$x^{(start)}$|

for i in 1:N
  |$x'$| = sample from |$\boldsymbol{\mathbf{q \: \vert \: x^{(i)}}}$|
  |$c$| = sample from |$U(0, 1)$|
  a = |$\alpha(x^{(i)}, x')$|

  if a > c:
  	|$x^{(i+1)}$| = |$x'$|
  else
  	|$x^{(i+1)}$| = |$x^{(i)}$|
  end
end 

output |$x^{(1)}$|, ..., |$x^{(i)}$|
\end{lstlisting}

A discussion of the proof of the Metropolis-Hastings can be found in Appendix \ref{proof:metro}.


#### Choosing a proposal distribution

The choice of the right proposal distribution is not straightforward, since the acceptance probability of the candidate depends on the proposed point. When we consider a proposal distribution with high variance, it will quickly converge to the target distribution since it makes large steps, however when converged the acceptance probability will not be high since it often makes proposals which are in the tail of the target distribution making $p_{\boldsymbol{\mathbf{\pi}}}(x')/p_{\boldsymbol{\mathbf{\pi}}}(x^{(i)})$, and therefore the acceptance probability small. In contrast when the variance of proposal distribution is small, we have the exact opposite problem, making the convergence slow when starting at a point way out of the high density interval of the target distribution, but having a high acceptance probability.

\begin{example}[The Metropolis-Hastings algorithm and different proposal distributions]


We have a dataset of $I=20$ data points $X_i$, $i = 1 ... I$ and we know the data points to be independently and identically normal distributed with unknown mean and known $\sigma_{real} = 0.2$. We want to infer the probability density of the mean $\boldsymbol{\mathbf{\mu}}$ using the Metropolis algorithm. Since we only want to infer the mean we have a one dimensional parameter space. In this example we assume we know that the parameter lies in the interval $\left[ -10, 10 \right]$ so we choose a uniform prior $U(-10, 10)$, for which the probability density is given by $p(\mu) = \frac{1}{20}$ for $-10 \leq \mu \leq 10$ and $p(\mu) = 0$ otherwise. In this example we generate the dataset by sampling 20 values from a normal distribution with $\mu_{real} = 0.4$ and $\sigma_{real} = 0.2$.

The Gaussian likelihood, defining the probability density of the dataset $\boldsymbol{\mathbf{X}}$, given one particular assignment of the parameter vector $\boldsymbol{\mathbf{\Theta}}$, is in this case given by the product of the likelihood of the individual data points, since we assume they are independent $p(X \: \vert \: \mu) = \prod_{i = 1}^{N} p_\text{norm}(X_i \: \vert \: \mu, \sigma)$, where $p_\text{norm}$ is the Gaussian probability density function.

To calculate the a-posteriori distribution of the mean parameter, we can use the Bayesian formula, and since we use a MCMC algorithm we only need to specify a function which is proportional to the posterior, i.e. the a-priori distribution times the likelihood:

$$p(\mu \: \vert \: X) = \frac{p(X \: \vert \: \mu)  \; p(\mu)}{\int_{\mu \in M} p(X \: \vert \: \mu)  \; p(\mu)  \; d\mu} \propto p(X \: \vert \: \mu) \; p(\mu)$$

We run the experiment three times with 2000 steps, using different Gaussian-distributed proposals with $\sigma=0.01$,  $\sigma=0.1$ and $\sigma=0.4$.

\begin{figure}[H]
\includegraphics[scale=0.5]{img/proposal_distributions.pdf}
\caption{Experiment \ref{ex:metropolis-proposal}: Three different runs of the Metropolis-Hastings algorithm using Gaussian-distributed proposals with $\sigma=0.01$ (top),  $\sigma=0.1$ (middle) and $\sigma=0.4$ (bottom). The different proposal distributions lead to different paths in the random walk and different acceptance rates (left, trace plot of the random walk) and different autocorrelations in the random walk (right, ACF plot for the random walk)}

\end{figure}

As we can see, a low standard deviation in the proposal distribution leads to a high acceptance rate, since the proposed points lie in the area with a high acceptance probability. However the points are highly autocorrelated which leads to a lower effective sample size (see Section \ref{p:ess}). A higher standard deviation in the proposal distribution leads to a smaller acceptance probability but also to a lower autocorrelation.

Since the random walk samples represent the a-posteriori distribution, which is in our case the a-posteriori distribution for the $\mu$ parameter, we can further analyze the samples, e.g. calculating the mean, or the posterior interval. The $100 (1-\alpha)\%$ posterior interval corresponds to the range of values above and below in which lies $100 (\frac{\alpha}{2}) \%$ of the posterior probability \citep{gelman2014bayesian}. 
We calculate the a-posteriori mean using the empirical mean of the random walk samples, and the 95\% posterior interval (PI) using the 5\% quantile and the 95\% quantile of the obtained samples (i.e. ordering all values and taking the 5\%/95\% smallest value). Table \ref{tbl:res-mp} shows the results of the experiment.

\begin{table}[ht]
\centering
\begin{tabular}{|r|l|r|l|}
  \hline
& $\sigma$ & mean & 95\% PI\\ 
  \hline
1 & 0.01 & 0.434 & [0.371, 0.497] \\ \hline 
  2 & 0.1 & 0.436 & [0.367, 0.514] \\ \hline
  3 & 0.4 & 0.440 & [0.380, 0.510] \\ 
   \hline
\end{tabular}
\caption{Example \ref{ex:metropolis-proposal}: Results of the three experiments: $\sigma$ of the proposal distribution, Empirical average and the 95\% posterior interval of the a-posteriori parameter $\boldsymbol{\mathbf{\mu \: \vert \: X}}$}

\end{table}

As we increase the step size or tweak the proposal distribution of the metropolis algorithm, the samples should better represent the "real" a-posteriori distribution (but not necessary making the posterior interval smaller). 

The R-Code for this example can be found in Appendix \ref{file:metropolis}.

\end{example}

## Hamilton Monte Carlo


One major flaw, characterizing all Metropolis-Hastings-based methods, is the inefficiency in models with many parameters (i.e. a high-dimensional target distribution), needing a long time to discover the whole space of interest in their random walk (\cite{gelman2014bayesian}). There are ways around this unwanted inefficiency, such as re-parameterization or more appropriate jumping distributions (exploring the target function with a higher acceptance rate), however this workarounds are often model specific. 

In contrast **Hamilton Monte Carlo (HMC, also called Hybrid Monte Carlo)** uses a different idea by introducing an auxiliary momentum variable for each parameter to suppress this unwanted random walk behavior. Hamilton Monte Carlo was introduced by \cite{duane1987hybrid} and this section is mainly based on the explanations provided by \cite{gelman2014bayesian}, \cite{stanmanual} and \cite{hoffman2011no}.

\paragraph{Intuition}

First we want to give a little intuition about how the HMC algorithm works, and how it is in many cases more efficient compared to the Metropolis algorithm. Image we have a one-dimensional target function with one mode (like the Gaussian density function), and the most recent step in the sampling process was in the left tail. Since we are using MCMC the next step will be dependent on the step before (Markov property), and ideally the next step would be to the high density region (i.e. somewhere in the middle). So now lets look how the next step proposal differs between the two algorithms. 

Using the Metropolis-Hastings-Algorithm, we are using a conditional proposal distribution centered on position of the last step, with some arbitrary, pre-chosen standard deviation. The proposal is a random relative step to the left or right\footnote{unless the proposal distribution function is specifically tuned} (see Section \ref{sec:metropolis}). When a step to the left is chosen, the proposal is likely to be rejected (because the density in the target function at a more left point is lower). Since the proposal distribution doesn't incorporate the shape of the target function, this is called a random walk, and thus leading to a high rejection rate, which is inefficient, because more steps are needed.

Now lets look how the HMC algorithm chooses the next step proposal. HMC uses, as the name suggests, Hamilton dynamics, which is a concept from theoretical physics, to avoid the random walk behavior of the Metropolis-Hastings algorithm. Hamilton dynamics fully describes a physical system in terms position and momentum vectors plus some equations on how these vectors change over time. The important part here is, that the whole dynamics only describe an exchange between kinetic energy and potential energy, where the energies are a function of the position and momentum vectors, but the total energy will always be constant. One could image a (frictionless) swinging pendulum, where at the highest points the kinetic energy is zero and the whole energy is in the potential part, and on the lowest point, in the middle, where the whole energy of the system is in the kinetic part. 

In simple terms, in HMC, the last step is taken as the position, then some random momentum is chosen, and the potential energy is set to be proportional to the negative density of the target function at this position. Then the Hamiltonian system is simulated for some amount of time, and  the resulting position is taken as the next proposal step. The important part here is the choice of the potential energy function: When we continue the thought experiment from above, having a Gaussian target function, one could image a marble which is placed on the left side of a U-shaped curve (i.e. turning the target function upside-down), where the curve here acts as a analogous to the potential energy function. We  push the marble in a random direction, and then take the marble position after one second as the next proposal step. As one can image a marble in a U-shaped curve, if we push the marble in some random direction, after some time, gravity will force the marble back to the middle, and also regions with high potential energies (the sides) require stronger pushes. Back to MCMC, when we imagine the marbles position at some time point as the proposed steps, this behavior is exactly what we want, proposing more positions in low potential energy regions (and thus high density regions), leading to a higher acceptance rate. 

\paragraph{Description of the Algorithm}

Again, our goal is to sample from a target distribution function $p_{\boldsymbol{\mathbf{\pi}}}(x)$ (which is usually the a-posteriori density $p(\Theta \: \vert \: X)$). 

As said, the HMC algorithm uses a special auxiliary momentum variable called $\rho$, which is of the same dimension as $\boldsymbol{\mathbf{\Theta}}$ (i.e. for each parameter in the target function, there is a corresponding momentum value). A zero-mean multivariate Gaussian distribution, which is independent from the parameters $\boldsymbol{\mathbf{\Theta}}$, is assigned to $\boldsymbol{\mathbf{\rho}}$ such that $\boldsymbol{\mathbf{\rho}} \sim MultiNormal(0, \Sigma)$, and a new joint density function is defined as $p(\Theta, \rho) = p(\Theta) \cdot p(\rho)$. \footnote{This is the most common setup for $\boldsymbol{\mathbf{\rho}}$ and also used by Stan, variants using other distributions for $\boldsymbol{\mathbf{\rho}}$ may exist}. $\Sigma$ is used to tune the performance of the integrator (see below).

Using a concept from statistical mechanics called canonical distributions (\cite{brooks2011handbook}) allows us to relate a random variable to a energy function by taking the negative logarithm of the density function. Using this canonical distribution, the joint density function now defines the Hamiltonian, describing the total energy of the system, as the sum of the kinetic energy $T(\rho)$ and potential energy $V(\Theta)$:

$$
  H(\rho, \Theta) = T(\rho) + V(\Theta) = -\log p(\rho) -\log p(\Theta)
$$

Using the Hamiltonian equations, which describe the dynamics of the position and momentum vector, we can now derive the behavior of our system:

$$
\frac{d\Theta}{dt} = \frac{\partial H}{\partial \rho} = \frac{\partial T}{\partial \rho} \\
\frac{d\rho}{dt} = - \frac{\partial H}{\partial \Theta} = - \frac{\partial V}{\partial \Theta}
$$

We are now left with two differential equations which must be discretized in order to be simulatable by a computer. Discretization works by dividing the system into a subset of small discrete time points and iteratively approximating the state for each time step, while ideally keeping the discretization error as small as possible.

The leapfrog algorithm is such an advanced discretization method, which is specifically tuned for the Hamiltonian equation system and it preserves the reversibility and volume preservation properties of the Hamilton system in the discretization step, which is important for the theoretical implications of the resulting Markov Chain. 

The leapfrog method is started by choosing a time interval (also called step-size) $\epsilon$, which sets the discretization step-size when advancing the system using the derived dynamics of the Hamiltonian system. The leapfrog algorithm works by taking a half step on the momentum, a full step on the position, and finally a half step on the momentum, which results in a total step by $\epsilon$ for both variables \citep[for a detailed discussion of the leapfrog algorithm see][]{gelman2014bayesian}:

$$
\rho = \rho - \frac{\epsilon}{2}\frac{\partial V}{\partial \Theta}\\
\Theta = \Theta + \epsilon \frac{\partial T}{\partial \rho} = \Theta + \epsilon \; \Sigma \; \rho\\
\rho = \rho - \frac{\epsilon}{2}\frac{\partial V}{\partial \Theta}
$$

After the leapfrog method has done an pre-chosen amount of steps, in the last step of the HMC algorithm a Metropolis-Hastings acceptance step is performed. This is only required because of discretization discrepancy compared to the real dynamics. The proposed step can be rejected, when the total energy of the new state is higher than the total energy of the old state:

$$
P(\text{accept proposed step } \Theta') = \min(1, e^{H(\rho^{(i)}, \Theta^{(i)}) - H(\rho', \Theta')})
$$


\begin{lstlisting}[escapechar=|, caption={Hamilton Monte Carlo Algorithm}]
input parameters:
  |$\Theta$|: starting position, vector of size S
  V(|$\Theta$|): potential energy function 
  dV(|$\Theta$|): gradient of the potential energy function
  |$\epsilon$|: Leapfrog step-size 
  L number: of Leapfrog steps to take
  N number: of samples

define kinetic energy function T(|$\rho$|) = |$\frac{1}{2} \sum_{i=1}^{S} \rho_i^2$|
P = vector of size N
for t in 1:N
  |$\rho$| = sample from S-dimensional Standard Multivariate Gaussian
  |$\Theta_{old}$| = |$\Theta$|; |$\rho_{old}$| = |$\rho$|
  
  simulate L Leapfrog steps with |$\rho$|, |$\Theta$|, using step size |$\epsilon$| and gradient dV(|$\Theta$|)

  |$p_{accept}$| = min(1, exp( (V(|$\Theta_{old}$|) + T(|$\rho_{old}$|)) - (V(|$\Theta$|) + T(|$\rho$|)) ))

  |$c$| = sample from |$U(0, 1)$|
  if |$p_{accept}$| > c:
    |$P^{(t)}$| = |$\Theta$|
  else
    |$P^{(t)}$| = |$\Theta$| = |$\Theta_{old}$| # rejected, continue on position |$\Theta_{old}$|
  end
end

output |$P^{(1)}$|, ...,|$P^{(t)}$|
\end{lstlisting}
\footnote{$\Sigma$ is assumed to be the identity matrix, so no correlation between the variables}

A proof that the Hamilton Monte Carlo algorithm produces a proper Markov Chain for MCMC can be found, for example, in \cite{brooks2011handbook}.

\paragraph{Discussion}

In this section we introduced the Hamilton Monte Carlo algorithms. The HMC algorithm is often more efficient in higher dimensions by avoiding the random walk behavior of the Metropolis-Hastings algorithm.

But the HMC is also not without problems in practice: we have to choose parameters of the algorithm, such as the step size and number of steps for leapfrog and also in practice the covariance matrix $\Sigma$ of $\boldsymbol{\mathbf{\rho}}$ has to be chosen to improve the performance of the algorithm. Also the gradient of the parameter vector in terms of the potential energy function has to be derived manually. 

In the next section we introduce the probabilistic programming language Stan which uses the NUTS algorithm, which attempt to solve some of the discussed caveats of the HMC algorithm.

## Probabilistic Programming Languages

Probabilistic programming languages (PPL) are programming languages define a domain specific language (DSL) for describing statistical models and doing inference on these models. For the inference task, they often use Markov chain Monte Carlo algorithms, although this is not required (e.g. Infer.NET a PPL framework for .NET languages uses a message-passing algorithm).

Advantages of using a PPL over a custom implemented algorithm is obviously its simplicity. With a PPL we are concentrating on the "what" task, i.e. we describe a statistical model using a custom language, which this is a more declarative approach. 
When implementing the algorithm manually, the model is already embedded within the algorithm, this follows a more imperative approach, concentrating on the "how" part. Of course, a custom algorithm provides the most flexibility but often this flexibility is not needed, and other aspects such as ease of use and verifiability are more important, which favors a PPL approach.

## Stan

We decided to use Stan as the PPL for this thesis, so in this section we will give a kind introduction and then will further introduce the features of Stan and the structure of a Stan program.

The Stan project was initially started by Gelman and Hill (\cite{stanmanual}) after discovering shortcomings with BUGS (\cite{lunn2000winbugs}) and JAGS (\cite{hornik2003jags}), which are probabilistic programming languages based on Gibbs sampling, a Metropolis-Hasting based approach, when they wanted to fit a multilevel generalized linear model in their paper \cite{gelman2007data}. At this time they got more involved into the Hamiltonian Monte Carlo algorithm which was able to overcome the shortcomings of Metropolis-Hasting based approaches (see Section \ref{sec:hmc}). Since then, the Stan project evolved continuously and has now developed a strong community and users from many different fields. 

### The NUTS algorithm

Stan uses the Hamiltonian Monte Carlo algorithm or in particular a modification of the HMC algorithm called NUTS, the No-U-turn sampler. In \cite{hoffman2011no} they propose a method to automatically determine the two parameters of the HMC algorithm, namely the step size and the desired number of steps, which they called the No-U-Turn sampler. To set the number of steps, the method uses a recursive procedure to build a list of possible trajectories along the target distribution while avoiding retracing ("no U-turns"). They show that this procedure of choosing the number of steps performs at least as efficient as manually tuning the parameter. The step size is optimized using a optimization method called "primal-dual averaging", and therefore the NUTS algorithm needs no manual parameter input at all, which makes it very suitable for use in a computing environment like Stan.

### Reverse-mode algorithmic differentiation

One disadvantage when choosing the HMC algorithm in favor of the Metropolis-Hastings approach, is that the HMC algorithm needs gradient information (i.e. the first derivatives of all parameters of the target distribution). In general, manually deriving the gradient is no problem, however it can be quite cumbersome, error prone and also time intensive, especially when used in a computing environment like Stan, in which the user focuses on the modeling part rather than on the technical details of the underlying algorithms. 

Stan uses a method which is able to automatically derive the required gradients of the target distribution called reverse-mode algorithmic differentiation, avoiding these manual steps. In this paragraph, which give a brief overview of how this algorithm works.

Reverse-mode algorithmic differentiation (short Reverse-mode AD, also called automatic differentiation, \cite{carpenter2015stan}) is an algorithm which computes the value of the gradient of a function $f$ automatically. Automatic differentiation, unlike numerical derivation methods such as finite differencing, is exact (up to the machine precision). Also Automatic differentiation may not be confused with Automatic Symbolic differentiation, as used for example in Mathematica, whose output is the entire symbolic derivative function expression whereas algorithmic differentiation only outputs the values for the derivative. Although Automatic Symbolic differentiation has its place for certain applications (e.g. when a symbolic expression for a derivative is needed, for example in a Computer Algebra System), it has also certain difficulties (see \cite{carpenter2015stan}). It might seem, that Automatic Symbolic differentiation is more powerful, because it works with symbols, however the opposite is the case, in fact Automatic differentiation is more expressive in the sense that Automatic differentiation can be used to calculate the derivative not only of functions in the mathematical sense but also derivatives of computer programs which include loops, conditionals and function calls.

Algorithmic differentiation uses the meta-programming features of programming languages such as C++ (the Stan Reverse-mode algorithmic differentiation is implemented in C++) to transform the program or function of interest into an expression graph. This expression graph only consists of subexpressions, for which the derivatives are known (e.g. simple expressions like $a+b$ or functions like $sin(x)$) and then the chain rule $\frac{\partial f}{\partial x_i} = \sum_{j = 1}^N \frac{\partial f}{\partial u_j} \frac{\partial u_j}{\partial x_i}$ is used to calculate the derivative ($u_j$ in this case represent the subexpressions). First the subexpressions and all partial derivatives thereof are determined (called forward pass). In the following reverse pass, each subexpression is assigned a adjoint value, for the root node (the output value), the adjoint value is $1$ for all the others it is $0$. The expression graph is traversed, multiplying the adjoint values, which then represent the derivatives, and therefore after the pass, the adjoints of the input variables contain the gradients.

### The syntax of a Stan program

Stan is an imperative domain specific language (\cite{stanmanual}). Imperative means, it is possible to use imperative language constructs such as conditionals, loops and functions. Domain specific means, that a Stan program defines a program for a specific domain and is not meant for general purpose programming.

In a nutshell, a Stan program defines a conditional probability function $p(\Theta \: \vert \: X)$ using a specialized domain specific syntax, where $\boldsymbol{\mathbf{\Theta}}$ stands for the unknown parameters of the model and $X$ for the collection of all observed data.

Since the syntax of Stan is mostly based on ordinary programming languages we won't go into much detail onto how commonly known things like assignments or loops works, instead we only talk about the details, which aren't that common in other programming languages or behave different from what a typical user would expect. 

Stan is strongly and statically typed, every variable must have a declared type which cannot change. There are two primitive types \textit{real} for continuous variables and \textit{int} for integer values. Stan also provides data-types for Vectors (\textit{vector} and \textit{row\_vector}), matrices (\textit{matrix}), arrays (e.g. \textit{real xs[4]}, defines a array with name \textit{xs} of type \textit{real} and length 4) and specialized types, which are often used in statistical models (e.g. \textit{corr\_matrix} which defines a matrix which is positive definite, symmetric, unit diagonal and whose entries are between -1 and 1). 

Constraints for data types are also allowed in a Stan program (e.g. \textit{real\textless lower=0\textgreater  x}, defines a non negative real). For input parameters, the constraints provide a mechanism for error checking and for parameters the constraints provide implicit priors (see below).

As said, a Stan program defines a conditional probability function and when executed, the \text{model} block is executed once for each sample. The \text{model} block is so to say, the heart of a Stan program, which returns the conditional probability of the model. In Section \ref{ex:stan} we demonstrate the structure and syntax of an Stan program based on an example.

### Stan in practice

\paragraph{Interfacing with R}

In a practical application, Stan is used through an interface (\cite{stanmanual}). A Stan interface is used to control the compilation and the execution (i.e. the sampling) of a Stan program, through the interface the sampler also receives its input parameters and after the sampling process is finished, the output samples are also received through the interface.

In this thesis we concentrate on the R interface RStan, since R is our computing environment of choice, so all parameters will be fed in through R and also the post-run analysis is done with R.

\paragraph{Number of chains and startup}

Since the starting point of a MCMC simulation is random in the general case, the iterative simulation may take a number of samples to find the high probability space of the target distribution. Therefore early samples may not be representative for the target distribution and are usually discarded for further calculations. These initial samples are usually called warm-up or burn-in samples. 

There is no common agreed number, of how many initial samples should be discarded and that number also depends on the algorithm and the parameters. Gelman uses the general conservative practice of discarding the first of all samples.

Another parameter of a MCMC simulation is how many individual chains should be run. Each individual chain is independent and does one execution of the particular MCMC algorithm. At the end all samples obtained by the individual chains, after discarding the warm-up samples, are then collected into a common pool.

There is no common agreed number of how many chains should be used and if its better to run one very long or more but shorter chains. In practice often the number of chains is set to the number of CPU cores, since each chain is independent and can run on one core, and so the computing power is efficiently distributed.

\paragraph{Traceplot}

The traceplot is a plot of the sampled parameters against the iteration number. The traceplot shows us how the MCMC explored the parameter-space, and can be used to visually assess the convergence and mixing behavior of individual parameters.

\paragraph{Effective sample size}


By definition of the Markov property each sample obtained by the Markov chain is dependent on the value of the prior sample $x^{(i)} \: \vert \: x^{(i-1)}$. This means the correlation between two adjacent samples, i.e. the autocorrelation, is not $0$. This is usually taken into account when calculating the effective sample size, since it is smaller when the samples are more correlated, since each sample gives marginally less information of the distribution of interest.

The effective sample size as proposed by \cite{gelman2014bayesian}
is:
$$
N_{eff} = \frac{N}{1 + 2 \sum_{k=1}^{\infty} \rho(k)}
$$

where $N$ is the total number of samples, $N_{eff}$ the effective sample size, and $\rho(k)$ the autocorrelation of the samples at lag $k$. In practical applications the infinite sum is stopped when $\rho(k) < 0.05$
because usually $\rho(k + 1)  < \rho(k)$ holds (\cite{kruschke2014doing}).

How many effective samples are sufficient, and therefore how long the chain should run, depends on the particular application and the measure of interest.

\paragraph{R-hat} 

R-hat is a measure of the convergence of a chain (\cite{gelman2014bayesian}). When a chain converged, it should have mixed and be stationary. It works by splitting up each chain at the half and computing a measure which uses between- and within-chain variance. In the limit $n \to \infty$ R-hat approaches one. Intuitively, if the possible scale reduction is high, further samples can improve the accuracy of the estimate of the target distribution. For practical applications, \cite{gelman2007data} suggest a R-hat threshold of 1.1. In the case study we also use this threshold, rerunning the simulation when R-hat is greater 1.1.

\paragraph{Example usage of Stan}

\begin{example} 
We want to show an example use of Stan using the setup from Example \ref{ex:metropolis-proposal}:

We have a dataset of $N=20$ data points $X_i$, $i = 1 ... N$ and we know the data points to be mutually independent and identically normal distributed with known $\sigma = 0.2$. We want to the a-posteriori distribution of $\boldsymbol{\mathbf{\mu}}$. We assume we know that the parameter lies in the interval $\left[ -10, 10 \right]$ so we choose a uniform prior $U(-10, 10)$ on $\boldsymbol{\mathbf{\mu}}$.

We could incorporate this setup into a Stan model as follows:

\begin{lstlisting}[escapechar=|, caption={Stan example}]
data {
  int N;
  vector[N] x;
}
parameters {
  real mu;
}
model {
  mu ~ uniform(-10, 10);
  x ~ normal(mu, 0.2);
}
\end{lstlisting}

In the data section we define all input parameters of the model. In the parameter section we define our $\boldsymbol{\mathbf{\mu}}$ parameter as a real variable. The model section then defines the uniform prior on $\boldsymbol{\mathbf{\mu}}$ and the normal distribution for $\boldsymbol{\mathbf{X \: \vert \: \mu, \sigma=0.2}}$.

Having defined the model, we then can start the sampling process by calling within R:
\begin{lstlisting}[escapechar=|, caption={R}]
res = stan(model_code=stan_model, data=list(N=length(x), x=x), chains=1, warmup=200, iter=2000, init=0)
\end{lstlisting}

We run the sampler using the same configuration as in Example \ref{ex:metropolis-proposal}, using a warm-up size of 200, total number of steps of 2000, and starting point at 0.

We can use the $summary(res)$ function to get a overview of the inferred parameters. The approximated expected value of $\boldsymbol{\mathbf{\mu \: \vert \: X}}$ is $0.438$, and the 95\% posterior interval\footnote{The $100 (1-\alpha)\%$ posterior interval corresponds to the range of values above and below in which lies $100 (\alpha/2) \%$ of the posterior probability \citep{gelman2014bayesian}} of $\boldsymbol{\mathbf{\mu \: \vert \: X}}$ is $\lbrack0.345, 0.522\rbrack$.

The effective sample size obtained by the sampling process was $N_{eff} = 663$, and the R-hat value was $1.0004098$, which is a indicator that the chain has successfully converged to the target distribution.

When we compare the trace plot and autocorrelation function (Figure \ref{fig:stan_example}), we see that the resulting Markov chain has less autocorrelation than those of Example \ref{ex:metropolis-proposal}.

\begin{figure}[H]
\includegraphics[scale=0.5]{img/stan_example.pdf}


\caption{Experiment \ref{ex:stan}: Stan example using an HMC-based algorithm, Left: Trace plot of $\boldsymbol{\mathbf{\mu \: \vert \: X}}$, Right: Autocorrelation of the samples of $\boldsymbol{\mathbf{\mu \: \vert \: X}}$}
\end{figure}

As we could see in this example, using Stan is very convenient in practice, because it only requires us to specify the model in a declarative way. Because we are using an Hamiltonian Monte Carlo based algorithm, we would normally be required to specify the step size and number of steps for leapfrog and also the covariance matrix $\Sigma$ of $\boldsymbol{\mathbf{\rho}}$. The NUTS algorithm is used by Stan to find good values for these parameters in the warm-up period. Also the gradient of the parameter vector is needed, however Stan automatically calculates these by using the automatic algorithmic differentiation method. 

The R-Code for this example can be found in Appendix \ref{file:stan}.

\end{example}

## Summary

In this chapter we introduced the Bayesian theorem as the basis for Bayesian inference. We further explored the difficulties in the practical applications of Bayesian inference when using complicated models, which are often hard to solve or even mathematically intractable. 

We then proceed to Monte Carlo algorithms to numerically solve the Bayesian inference problem, and thus avoiding this mathematical inconvenience. We saw, although these methods can be used to do Bayesian analysis numerically, they suffer from high variance in higher dimensions. 

We introduced MCMC as an alternative to sample from arbitrary probability distributions using a purpose-built Markov chain. We explored the Metropolis-Hastings algorithm, however we saw, that these algorithm can be inefficient in high dimensions and when using complicated models. An advanced MCMC algorithm, namely Hamilton Monte Carlo is then introduced which aims to solve this efficiency issue by avoiding a random walk. 

In the last section we introduced probabilistic programming languages which provide a domain specific language for doing Bayesian inference using MCMC in a declarative and user friendly way. We further focused on the probabilistic programming language called Stan which will be used in the case study of this thesis. We introduced the techniques, which Stan uses, in particular an HMC based algorithm called NUTS, and algorithmic differentiation to algorithmically obtain the gradients of the target distribution.

In the next chapter, we now use the built theoretical basis from the last two chapter to conduct a case study and investigate whether the Bayesian models are
superior to the classical Mean/Variance MLE approach.




